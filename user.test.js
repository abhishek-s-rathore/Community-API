const request = require('supertest');
const app = require('./app');
const User = require('./models/UserModel');
const Question = require('./models/QuestionModel');
const Answer = require('./models/AnswerModel');

// text: 'hey all , here is my answer',
let user, userID, token, grabId;

const userCredential = {
  email: 'qwerty900@gmail.com',
  username: 'qwerty900',
  password: 12345,
};
const user1 = {
  email: 'narendra@gmail.com',
  username: 'narendra',
  password: 12345,
};
// beforeAll(async () => {
//   await User(user1).save();
// });

// beforeAll(async () => {
//   let username = await User.find({ username: 'narendra' });
//   console.log('zzzzzzzzzzzzzzzzzzzz', username[0]._id);
//   dummy.push(username[0]._id);
// });
// console.log('zzzzz outside', dummy);
jest.setTimeout(10000);

test('user register', async () => {
  return await request(app)
    .post('/api/users/register')
    .send(userCredential)
    .expect(200)
    .then((res) => {
      expect(res.body).toBeDefined();
      token = res.body.user.token;
    });
});

test('user login', async () => {
  await request(app).post('/api/users/login').send(userCredential).expect(200);
});

test('Get Current User Detail', async () => {
  return await request(app)
    .get('/api/users/currentUserData')
    .set('Authorization', token)
    .expect(200);
});

// ************* started profile testing *************
//Get  user profile details
test('Get Current User Detail', async () => {
  console.log(token, 'token');

  grabId = await User(user1).save();

  return await request(app)
    .get('/api/profile/' + userCredential.username)
    .set('Authorization', token)
    .expect(200);
});
// console.log('outside',grabId._id);
//Update the user profile details
test('Update profile', async () => {
  return await request(app)
    .put('/api/profile/' + userCredential.username)
    .set('Authorization', token)
    .send({ email: 'qwerty600@gmail.com' })
    .expect(200);
});
//Follow user
test('Follow user', async () => {
  grabId = await User.find({
    username: 'narendra',
  });
  return await request(app)
    .get('/api/users/follow/' + grabId[0]._id)
    .set('Authorization', token)
    .expect(200);
});
//Unfollow user
test('Unfollow user', async () => {
  grabId = await User.find({
    username: 'narendra',
  });
  return await request(app)
    .get('/api/users/unfollow/' + grabId[0]._id)
    .set('Authorization', token)
    .expect(200);
});
// *************question testing***************

//Create  a new Question

test('Create  a new Question', async () => {
  return await request(app)
    .post('/api/questions/')
    .set('Authorization', token)
    .send({
      title: 'how to train a dragon',
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years,grabIdtimes by accident,grabIdtimes on purpose (injected humour and the like).",
      tags: 'education,knowledge',
      questionId: '12345',
    })
    .expect(200);
});

//Get All the Questions
test('Get Current User Detail', async () => {
  return await request(app)
    .get('/api/questions/')
    .set('Authorization', token)
    .expect(200);
});
//Update Question using Id
test('Update Question using Id', async () => {
  grabId = await Question.find({ title: 'how to train a dragon' });
  // let questionsAll = await Question.find({ author:grabId[0]._id });

  return await request(app)
    .put('/api/questions/' + grabId[0]._id)
    .set('Authorization', token)
    .send({ description: 'hello pen please' })
    .expect(200);
});

//Create New Answer

test('Create New Answer', async () => {
  grabId = await Question.find({ title: 'how to train a dragon' });

  return await request(app)
    .post('/api/questions/' + grabId[0]._id + '/answers')
    .set('Authorization', token)
    .send({
      text: 'hey all , here is my answer',
    })
    .expect(200);
});

//Get All the List of Answers

test('Get All the List of Answers', async () => {
  grabId = await Question.find({ title: 'how to train a dragon' });
  return await request(app)
    .get('/api/questions/' + grabId[0]._id + '/answers')
    .set('Authorization', token)
    .expect(200);
});
//Upvote the Question
test('Upvote the Question', async () => {
  grabId = await Question.find({ title: 'how to train a dragon' });
  return await request(app)
    .get('/api/questions/upvote/' + grabId[0]._id)
    .set('Authorization', token)
    .expect(200);
});
//Delete the Upvote of the question
test('Delete the Upvote of the question', async () => {
  grabId = await Question.find({ title: 'how to train a dragon' });
  return await request(app)
    .get('/api/questions/removeupvote/' + grabId[0]._id)
    .set('Authorization', token)
    .expect(200);
});
//Create a Comment on your question
test('Create a Comment on your question', async () => {
  grabId = await Question.find({ title: 'how to train a dragon' });

  return await request(app)
    .post('/api/questions/comment/' + grabId[0]._id)
    .set('Authorization', token)
    .send({
      text: 'iam comment over here',
    })
    .expect(200);
});
//Update Answer using Id

test('Update Answer using Id', async () => {
  grabId = await Answer.find({
    text: 'hey all , here is my answer',
  });
  // let questionsAll = await Question.find({ author:grabId[0]._id });

  return await request(app)
    .put('/api/answers/' + grabId[0]._id)
    .set('Authorization', token)
    .send({ text: 'here is my answer for how to train a dragon' })
    .expect(200);
});

//Upvote the Answer
test('Upvote the Answer', async () => {
  grabId = await Answer.find({
    text: 'here is my answer for how to train a dragon',
  });
  return await request(app)
    .get('/api/Answers/upvote/' + grabId[0]._id)
    .set('Authorization', token)
    .expect(200);
});
test('Create New Answer', async () => {
  grabId = await Question.find({ title: 'how to train a dragon' });

  return await request(app)
    .post('/api/questions/' + grabId[0]._id + '/answers')
    .set('Authorization', token)
    .send({
      text: 'hey all , here is my answer',
    })
    .expect(200);
});
//Delete the upvote for the answer
test('Delete the Answer', async () => {
  grabId = await Answer.find({
    text: 'here is my answer for how to train a dragon',
  });
  return await request(app)
    .get('/api/Answers/removeupvote/' + grabId[0]._id)
    .set('Authorization', token)
    .expect(200);
});
//Create an new Comment
test('Create an new Comment', async () => {
  grabId = await Answer.find({
    text: 'here is my answer for how to train a dragon',
  });
  return await request(app)
    .post('/api/answers/comment/' + grabId[0]._id)
    .set('Authorization', token)
    .send({
      text: 'Here is my comment for answer',
    })
    .expect(200);
});
//Get all the list of avaialable Tags
test('Get all the list of avaialable Tags', async () => {
  return await request(app)
    .get('/api/tags/')
    .set('Authorization', token)
    .expect(200);
});

// ********delete content*********

// Delete question using the slug
test('Delete question using the slug', async () => {
  return await request(app)
    .delete('/api/questions/how-to-train-a-dragon')
    .set('Authorization', token)
    .expect(200);
});
//Delete Answer
test('Delete Answer using answerId', async () => {
  grabId = await Answer.find({
    text: 'here is my answer for how to train a dragon',
  });
  return await request(app)
    .delete('/api/answers/' + grabId[0]._id)
    .set('Authorization', token)
    .expect(200);
});
