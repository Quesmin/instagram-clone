import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalStyle] = useState(getModalStyle);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);

      } else {
        setUser(null);
      }
    })

    return () => {
      //perform cleanup
      unsubscribe();
    }
  }, [user, username]);


  useEffect(() => {
    db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        }))
        )
      });
  }, []);

  const signUp = e => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch(error => alert(error.message))

    setOpen(false);
  }

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="app">




      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signUp' action="">
            <center>
              <img
                className='app__headerImage'
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" />
            </center>
            <Input
              type='text'
              placeholder='username'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <Input
              type='text'
              placeholder='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <Button type='submit' onClick={signUp}>Sign Up</Button>
          </form>

        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signUp' action="">
            <center>
              <img
                className='app__headerImage'
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" />
            </center>
            <Input
              type='text'
              placeholder='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <Button type='submit' onClick={signIn}>Sign In</Button>
          </form>

        </div>
      </Modal>

      <div className="app__header">
        <img
          className='app__headerImage'
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        {user ?
          <Button onClick={() => auth.signOut()}>Log Out</Button>
          :
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        }
      </div>

      <div className="app__posts">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>

      <div className="app__uploadContainer">
        {user?.displayName ?
          <ImageUpload username={user.displayName} />
          :
          <h3 style={{textAlign:'center'}}>Sorry you need to login to upload</h3>
        }
      </div>


    </div>
  );
}

export default App;
