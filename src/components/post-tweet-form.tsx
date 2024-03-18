import { Button } from '@mui/material';
import { styled as BasicStyled } from 'styled-components';
import { styled } from '@mui/system';
import { useForm } from 'react-hook-form';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firbase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';

const Form = BasicStyled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = BasicStyled.textarea`
  border: 1px solid black;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  

  &:focus {
    outline: none;
    border-color: #1d9bf9;
  }
`;

const AttachFileButton = BasicStyled.label`
  padding: 10px 0px;
  color: #1d9bf9;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf9;
  font-size: 14px;
  cursor: pointer;
`;

const AttachFileInput = BasicStyled.input`
  display: none;
`;

const TweetButton = styled(Button)`
  padding: 10px 0px;
  font-size: 16px;
  background-color: #1d9bf9;
  color: white;
  opacity: 0.9;
  &:hover {
    background-color: #1d9bf9;
    opacity: 1;
  }
`;

const DisplayLength = BasicStyled.div`
  margin-top:-46px;
  margin-bottom:20px;
    text-align:right;
  transform:translate(-10px);
  color:#B4B4B8 ;
 `;

export default function PostTweetForm() {
  const { register, watch, handleSubmit, setValue, formState } = useForm();
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const textLength = watch('tweetText');

  const onValid = async (data: any) => {
    const user = auth.currentUser;

    try {
      const doc = await addDoc(collection(db, 'tweets'), {
        tweet: data.tweetText,
        createdAt: Date.now(),
        username: user?.displayName || 'Anonymous',
        userId: user?.uid,
        avatarUrl: user?.photoURL,
      });

      if (file) {
        const locationRef = ref(storage, `tweets/${user?.uid}-${user?.displayName}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, { photo: url });
      }

      setValue('tweetText', '');
      setPreviewImage('');
    } catch (e) {
      console.log('에러:', e);
    }
  };

  const onImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files[0]) {
      const previewURL = URL.createObjectURL(files[0]);
      setPreviewImage(previewURL);
      setFile(files[0]);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onValid)}>
        <TextArea
          rows={5}
          maxLength={180}
          {...register('tweetText', { required: true })}
          placeholder="무슨 일이 일어나고 있나요?"
        />

        <DisplayLength>{textLength ? textLength.length : '0'}/180</DisplayLength>
        {previewImage && <img src={previewImage} alt="Preview" style={{ width: '100%', height: 'auto' }} />}
        <AttachFileButton htmlFor="file">
          {previewImage != '' ? '다른 사진으로 변경하기' : '사진 추가하기'}
        </AttachFileButton>
        <AttachFileInput
          {...register('imageFile')}
          id="file"
          type="file"
          accept="image/*"
          onChange={onImagePreview}
        ></AttachFileInput>
        <TweetButton type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? '게시중...' : '게시하기'}
        </TweetButton>
      </Form>
    </>
  );
}
