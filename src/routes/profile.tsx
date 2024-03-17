import styled from 'styled-components';
import { auth, db, storage } from '../firbase';
import { useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useForm } from 'react-hook-form';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { ITweet } from '../components/timeline';
import Tweet from '../components/tweet';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
`;
const AvatarImg = styled.img`
  width: 80px;
  height: 80px;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

export default function Profile() {
  const { register } = useForm();

  const user = auth.currentUser;

  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);

  const onAvatarChage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user && e.target.files) {
      const file = e.target.files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const url = await getDownloadURL(result.ref);
      setAvatar(url);
      await updateProfile(user, { photoURL: url });

      /*  await updateDoc(collection(db, 'tweets'), {
        avatarUrl: url,
      }); */
    }
  };

  const fetchMyTweets = async () => {
    const tweetQuery = await query(
      collection(db, 'tweets'),
      where('userId', '==', user?.uid),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(tweetQuery);

    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return { tweet, createdAt, userId, username, photo, id: doc.id };
    });
    console.log(tweets);
    setTweets(tweets);
  };

  useEffect(() => {
    fetchMyTweets();
  }, []);

  return (
    <>
      <Wrapper>
        <AvatarUpload htmlFor="avatarID">
          {avatar ? <AvatarImg src={avatar} /> : <AccountCircleIcon sx={{ fontSize: 70 }} />}
        </AvatarUpload>
        <AvatarInput {...register('avatar')} onChange={onAvatarChage} id="avatarID" type="file" accept="image/*" />
        <Name>{user?.displayName}</Name>

        <h3>나의 트위터 모아보기</h3>
      </Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </>
  );
}
