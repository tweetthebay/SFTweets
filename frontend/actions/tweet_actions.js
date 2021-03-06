// frontend/actions/tweet_actions.js
// @flow

import * as APIUtils from '../util/tweet_api_util';

export const RECEIVE_TWEETS = 'RECEIVE_TWEETS';
export const RECEIVE_TWEET_ERRORS = 'RECEIVE_TWEET_ERRORS';
export const CLEAR_TWEETS = 'CLEAR_TWEETS';
export const RECEIVE_SEARCH_QUERY = 'RECEIVE_SEARCH_QUERY';

export const setSearchQuery = (query: string) => ({
  type: RECEIVE_SEARCH_QUERY,
  query,
});

export const receiveTweets = (tweets: Array<Object>) => ({
  type: RECEIVE_TWEETS,
  tweets,
});

export const receiveTweetErrors = (errors: ?Array<string>) => ({
  type: RECEIVE_TWEET_ERRORS,
  errors,
});

export const clearTweets = () => ({
  type: CLEAR_TWEETS,
});

export const fetchTweets = (query: string, location: Object) => (dispatch: Function) =>
  APIUtils.searchTweets(query, location).then(
    data => dispatch(receiveTweets(data)),
    err => dispatch(receiveTweetErrors(err.responseJSON)),
  );
