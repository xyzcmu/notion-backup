let axios = require('axios')
    , { createWriteStream } = require('fs')
    , { join } = require('path')
    , notionAPI = 'https://www.notion.so/api/v3'
    , { NOTION_TOKEN, NOTION_SPACE_ID, NOTION_FILE_TOKEN } = process.env
    , client = axios.create({
        baseURL: notionAPI,
        headers: {
            Cookie: `token_v2=${NOTION_TOKEN}; file_token=${NOTION_FILE_TOKEN}`
        },
    })
    , die = (str) => {
        console.error(str);
        process.exit(1);
    }
    ;

if (!NOTION_TOKEN || !NOTION_SPACE_ID || !NOTION_FILE_TOKEN) {
    die(`Need to have NOTION_TOKEN, NOTION_SPACE_ID, and NOTION_FILE_TOKEN defined in the environment.
See https://medium.com/@arturburtsev/automated-notion-backups-f6af4edc298d for
notes on how to get that information.`);
}

async function post(endpoint, data) {
    return client.post(endpoint, data);
}

async function sleep(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

// formats: markdown, html
async function exportFromNotion(format) {
    try {
        let { data: { taskId } } = await post('enqueueTask', {
            task: {
                eventName: 'exportSpace',
                request: {
                    spaceId: NOTION_SPACE_ID,
                    exportOptions: {
                        exportType: format,
                        timeZone: 'America/New_York',
                        locale: 'en',
                    },
                },
            },
        });
        console.warn(`Enqueued task ${taskId}`);
        let exportURL;
        while (true) {
            await sleep(2);
            let { data: { results: tasks } } = await post('getTasks', { taskIds: [taskId] })
                , task = tasks.find(t => t.id === taskId)
                ;
            console.warn(`Pages exported: ${task.status.pagesExported}`);
            if (task.state === 'success') {
                exportURL = task.status.exportURL;
                break;
            }
        }
        let res = await client({
            method: 'GET',
            url: exportURL,
            responseType: 'stream'
        });
        let stream = res.data.pipe(createWriteStream(join(process.cwd(), `${format}.zip`)));
        await new Promise((resolve, reject) => {
            stream.on('close', resolve);
            stream.on('error', reject);
        });
    }
    catch (err) {
        die(err);
    }
}

async function run() {
    let cwd = process.cwd();
    await exportFromNotion('markdown');
    await exportFromNotion('html');
}

run();