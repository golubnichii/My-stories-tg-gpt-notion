import {Client} from '@notionhq/client'
import config from 'config'

// Initializing a client
const notion = new Client({
  auth: config.get('NOTION_KEY'),
})

const MAX_NOTION_LENGTH = 2000;


function splitContent(content) {
    let chunks = [];
    while (content.length) {
        chunks.push(content.substr(0, MAX_NOTION_LENGTH));
        content = content.substr(MAX_NOTION_LENGTH);
    }
    return chunks;
}

export async function create(short, text) {
    if (short.length > 2000) {
        console.error("Short content exceeds 2000 characters.");
        return;
    }

    const dbResponse = await notion.pages.create({
        parent: { database_id: config.get('NOTION_DB_ID') },
        properties: {
            Name: {
                title: [
                    {
                        text: {
                            content: short,
                        },
                    },
                ],
            },
            Date: {
                date: {
                    start: new Date().toISOString(),
                },
            },
        },
    });

    const contentChunks = splitContent(text);
    console.log("Total chunks:", contentChunks.length); // Log total number of chunks
    contentChunks.forEach((chunk, index) => {
        console.log(`Chunk ${index + 1} length:`, chunk.length); // Log each chunk's length
    });

    for (let chunk of contentChunks) {
        if (chunk.length > 2000) {
            console.error("Chunk exceeds 2000 characters. Skipping...");
            continue; // Skip this chunk
        }
        await notion.blocks.children.append({
            block_id: dbResponse.id,
            children: [
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [
                            {
                                type: 'text',
                                text: {
                                    content: chunk,
                                },
                            },
                        ],
                    },
                },
            ],
        });
    }

    return dbResponse;
}
