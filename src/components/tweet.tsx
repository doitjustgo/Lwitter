import styled from 'styled-components';
import { ITweet } from './timeline';
import { auth, db, storage } from '../firbase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto;
  padding: 20px;
  border: 1px solid gray;
  border-radius: 15px;
  margin: 5px;
`;
const Column = styled.div`
  display: flex;
  justify-content: space-between;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 16px;
`;

const DateText = styled.span`
  font-size: 12px;
  color: gray;
`;

const TweetBody = styled.p`
  margin: 10px 0px;
  font-size: 15px;
`;

const UploadImg = styled.img`
  width: 95%;
  max-height: 500px;
  border-radius: 5px;
`;

const DeleteDiv = styled.div`
  text-align: right;
`;

const DeleteIcon = styled(DeleteForeverIcon)`
  cursor: pointer;
  color: tomato;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`;

export default function Tweet({ username, userId, photo, tweet, id, createdAt }: ITweet) {
  const koreanTime = new Date(createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  const user = auth.currentUser;

  // 게시글 삭제 버튼 기능
  const onDelete = async () => {
    const ok = confirm('정말로 삭제하시겠습니까?');
    if (!ok) return;
    try {
      await deleteDoc(doc(db, 'tweets', id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user?.uid}-${user?.displayName}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <Column>
        <UserInfo>
          <Username>{username}</Username>
        </UserInfo>

        <DateText>{koreanTime}</DateText>
      </Column>
      <TweetBody>{tweet}</TweetBody>

      {photo ? (
        <Column>
          <UploadImg src={photo} />
        </Column>
      ) : null}
      <hr />
      <DeleteDiv>{user?.uid == userId ? <DeleteIcon onClick={onDelete}>삭제</DeleteIcon> : null}</DeleteDiv>
    </Wrapper>
  );
}
