import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firbase';
import Tweet from './tweet';

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function TimeLine() {
  const [tweets, setTweet] = useState<ITweet[]>([]);

  const fetchTweets = async () => {
    const tweetsQuery = query(collection(db, 'tweets'), orderBy('createdAt', 'desc'), limit(25));

    await onSnapshot(tweetsQuery, (snapshot) => {
      const tweets = snapshot.docs.map((doc) => {
        const { createdAt, tweet, userId, username, photo } = doc.data();
        return { id: doc.id, createdAt, tweet, userId, username, photo };
      });
      setTweet(tweets);
    });
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
