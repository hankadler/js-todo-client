import { gql } from "@apollo/client";

export const GET_ACTIVITIES = gql`
  query Activities {
    activities {
      _id
      index
      description
      completed
    }
  }
`;

export const CREATE_ACTIVITY = gql`
  mutation CreateActivity($input: CreateActivityInput!) {
    createActivity(input: $input) {
      success
      message
      activity {
        _id
        index
        description
        completed
      }
    }
  }
`;

export const UPDATE_ACTIVITY = gql`
  mutation UpdateActivity($activityId: ID!, $input: UpdateActivityInput!) {
    updateActivity(activityId: $activityId, input: $input) {
      success
      message
      activity {
        _id
        index
        description
        completed
      }
    }
  }
`;

export const SWAP_ACTIVITY_INDEXES = gql`
  mutation SwapActivityIndexes($indexA: Int!, $indexB: Int!) {
    swapActivityIndexes(indexA: $indexA, indexB: $indexB) {
      success
      message
      activities {
        _id
        index
        description
        completed
      }
    }
  }
`;

export const COMPRESS_ACTIVITY_INDEXES = gql`
  mutation CompressActivityIndexes {
    compressActivityIndexes {
      success
      message
      activities {
        _id
        index
        description
        completed
      }
    }
  }
`;

export const DELETE_ACTIVITY = gql`
  mutation DeleteActivity($activityId: ID!) {
    deleteActivity(activityId: $activityId) {
      success
      message
      activity {
        _id
        index
        description
        completed
      }
    }
  }
`;
