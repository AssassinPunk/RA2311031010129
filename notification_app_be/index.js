require('dotenv').config();
const { Log } = require('../logging_middleware/index');

const NOTIF_API = 'http://20.207.122.201/evaluation-service/notifications';

// type weights - placement is most important, then result, then event
// this is based on the priority rules given in the problem
const TYPE_WEIGHT = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
};

// converts timestamp string to unix seconds so we can compare easily
function toUnix(timestamp) {
    return Math.floor(new Date(timestamp).getTime() / 1000);
}

// scoring logic - higher weight = higher priority
// within same type, more recent = higher priority
function getScore(notification) {
    const weight = TYPE_WEIGHT[notification.Type] || 0;
    const time = toUnix(notification.Timestamp);
    // multiply weight by large number so type always wins over recency
    return weight * 1000000 + time;
}

// fetches all notifications from the api
async function fetchNotifications() {
    await Log('backend', 'info', 'service', 'fetching notifications from api');

    try {
        const res = await fetch(NOTIF_API, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
            }
        });

        if (!res.ok) {
            await Log('backend', 'error', 'service', `api responded with status ${res.status}`);
            throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        await Log('backend', 'info', 'service', `fetched ${data.notifications.length} notifications successfully`);
        return data.notifications;

    } catch (err) {
        await Log('backend', 'fatal', 'service', `failed to fetch notifications: ${err.message}`);
        throw err;
    }
}

// gets top n notifications by priority
// default is 10 as per the problem statement
async function getTopNotifications(n = 10) {
    await Log('backend', 'info', 'service', `computing top ${n} priority notifications`);

    const notifications = await fetchNotifications();

    // score and sort all notifications
    const sorted = notifications
        .map(notif => ({
            ...notif,
            score: getScore(notif)
        }))
        .sort((a, b) => b.score - a.score);

    // take top n
    const topN = sorted.slice(0, n);

    await Log('backend', 'info', 'service', `returning top ${n} notifications out of ${notifications.length}`);
    return topN;
}

// displays the top notifications in a readable format
function displayNotifications(notifications) {
    console.log('\n========================================');
    console.log(`   TOP ${notifications.length} PRIORITY NOTIFICATIONS`);
    console.log('========================================\n');

    notifications.forEach((notif, index) => {
        console.log(`#${index + 1}`);
        console.log(`  ID      : ${notif.ID}`);
        console.log(`  Type    : ${notif.Type}`);
        console.log(`  Message : ${notif.Message}`);
        console.log(`  Time    : ${notif.Timestamp}`);
        console.log(`  Score   : ${notif.score}`);
        console.log('----------------------------------------');
    });
}

// main function - runs once then polls every 30 seconds
// this handles the "new notifications keep coming in" requirement
async function main() {
    await Log('backend', 'info', 'service', 'priority inbox system started');
    console.log('Priority Inbox System Started...');
    console.log('Fetching top 10 notifications every 30 seconds\n');

    // run immediately on start
    try {
        const top10 = await getTopNotifications(10);
        displayNotifications(top10);
    } catch (err) {
        console.error('Error on first fetch:', err.message);
    }

    // then poll every 30 seconds for new notifications
    setInterval(async () => {
        console.log('\n[Polling] checking for new notifications...');
        await Log('backend', 'info', 'service', 'polling for new notifications');

        try {
            const top10 = await getTopNotifications(10);
            displayNotifications(top10);
        } catch (err) {
            console.error('Error during polling:', err.message);
            await Log('backend', 'error', 'service', `polling failed: ${err.message}`);
        }
    }, 30000);
}

main();