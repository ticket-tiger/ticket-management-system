import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, fireEvent, waitFor, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import SubmitTicket from './SubmitTicket';

// Declares which API requests to mock
const server = setupServer(
  rest.post('/create-ticket', (req, res, ctx) => res(ctx.json({ greeting: 'hello there' }))),
);

// establish API mocking before all tests
beforeAll(() => server.listen());
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// clean up once the tests are done
afterAll(() => server.close());

test('handlers status OK', async () => {
  render(<SubmitTicket />);

  fireEvent.click(screen.getByText('Submit'));

  // wait until the post request promise resolves and
  // the component calls setState and re-renders.
  // waitFor waits until the callback doesn't throw an error

  await waitFor(() => screen.getByRole('heading'));

  // assert that the alert message is correct using
  // toHaveTextContent, a custom matcher from jest-dom.
  expect(screen.getByRole('alert')).toHaveTextContent('Opps, failed to fetch!');

  // assert that the button is not disabled using
  // toBeDisabled, a custom matcher from jest-dom.
  expect(screen.getByRole('button')).not.toBeDisabled();

  server.use(
    // override the initial "POST /create-ticket" request handler
    // to return a 200 Status OK
    rest.post('/create-ticket', (req, res, ctx) => res(ctx.status(200))),
  );
});

test('Submits a ticket to the backend', async () => {
  // Arrange
  // Act
  // Asset
});
