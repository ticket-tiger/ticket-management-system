import { MongoClient } from 'mongodb';
import config from '../config.js';
import localConfig from '../localConfig.js';

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(`mongodb+srv://${localConfig.mongodb.username}:${localConfig.mongodb.password}@${config.mongodb.cluster}/${config.mongodb.database}?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
    });
    db = connection.db(config.mongodb.database);
  });

  afterAll(async () => {
    await db.collection('tickets').deleteOne({ _id: 'some-user-id' });
    await connection.close();
  });

  it('should insert a doc into collection', async () => {
    const tickets = db.collection('tickets');

    const mockTicket = { _id: 'some-user-id', description: 'Test test test.' };
    await tickets.insertOne(mockTicket);

    const insertedTicket = await tickets.findOne({ _id: 'some-user-id' });
    expect(insertedTicket).toEqual(mockTicket);
  });
});
