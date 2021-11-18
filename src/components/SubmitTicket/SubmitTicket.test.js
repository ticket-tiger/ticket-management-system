import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, fireEvent, waitFor, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
// import { act } from 'react-dom/test-utils';
import SubmitTicket from './SubmitTicket';

// Declares which API requests to mock
const server = setupServer();
// establish API mocking before all tests
beforeAll(() => server.listen());
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// clean up once the tests are done
afterAll(() => server.close());

test('handlers status 200 OK', async () => {
  server.use(
    rest.post('http://localhost:3001/api/create-ticket', (req, res, ctx) => res(ctx.status(200))),
  );
  render(<SubmitTicket />);
  fireEvent.click(screen.getByText('Submit'));
  // wait until the post request promise resolves and
  // the component calls setState and re-renders.
  // waitFor waits until the callback doesn't throw an error
  await waitFor(() => screen.getByTestId('responseStatus'));
  // assert that the alert message is correct using
  // toHaveTextContent, a custom matcher from jest-dom.
  await waitFor(() => expect(screen.getByTestId('responseStatus')).toHaveTextContent('200'));
});

test('handlers status 500 server error', async () => {
  server.use(
    rest.post('http://localhost:3001/api/create-ticket', (req, res, ctx) => res(ctx.status(500))),
  );
  render(<SubmitTicket />);
  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => screen.getByTestId('responseStatus'));
  await waitFor(() => expect(screen.getByTestId('responseStatus')).toHaveTextContent('500'));
});
