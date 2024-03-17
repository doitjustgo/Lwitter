import PostTweetForm from '../components/post-tweet-form';
import { styled } from 'styled-components';
import TimeLine from '../components/timeline';

const Wrapper = styled.div`
  display: grid;
  gap: 50px;

  grid-template-rows: auto;
`;

export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
      <hr style={{ width: '140%', height: '1px' }} />
      <TimeLine />
    </Wrapper>
  );
}
