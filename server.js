// Start server
import { app } from "./app.js";

const server = app.listen(3000, () => {
    console.log(`Server listening on port ${server.address()['port']}`);
});
setInterval(() => server.getConnections(
    (err, connections) => console.log(`${connections} connections currently open`)
), 10000);

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

// Graceful shutdown logic
let connections = [];

server.on('connection', connection => {
    connections.push(connection);
    connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});

function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}