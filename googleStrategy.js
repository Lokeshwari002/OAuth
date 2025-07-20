// const passport=require('passport');
// require("dotenv").config();
// const GoogleStrategy=require('passport-google-oauth20').Strategy



// const googleStrategy = (passport, db) => {

//        passport.use(
//         new GoogleStrategy({
//     clientID:process.env.CLIENT_ID,
//     clientSecret:process.env.CLIENT_SECRET,
//     callbackURL:"http://localhost:8002/auth/google/callback"
// },
// async(accessToken,refreshToken,profile,done)=>{
//     try{
//         const[rows]=await db.query("select * from users where google_id=?",[profile.id])
// if(rows.length>0){
//     return done(null,rows[0])
// }

// const[result]=await db.query("insert into users(google_id,user_name,email,picture)values(?,?,?,?)",[profile.id,profile.displayName,profile.emails[0].value,profile.photos[0].value])
//    const newUser={
//     id:result.insertId,
//     google_id:profile.id,
//     user_name:profile.displayName,
//     email:profile.emails[0].value,
//     picture:profile.photos[0].value
//    }  
//    return done(null,newUser)  



// }catch(err){
//     return done(err)
//     }
// }))


// passport.serializeUser((user,done)=>{
//     done(null,user.id)
// })

// passport.deserializeUser(async(id,done)=>{
//     const [rows]=await db.query("select * from users where id=?",[id])
//     done(null,rows[0])
// })
// }

// module.exports=googleStrategy


const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const googleStrategy = (passport, db) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8004/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const [rows] = await db.query(
            'SELECT * FROM users WHERE google_id = ?',
            [profile.id]
          );

          if (rows.length > 0) {
            return done(null, rows[0]);
          }

          const [result] = await db.query(
            'INSERT INTO users (google_id, user_name, email, picture) VALUES (?, ?, ?, ?)',
            [
              profile.id,
              profile.displayName,
              profile.emails[0].value,
              profile.photos[0].value,
            ]
          );

          const newUser = {
            id: result.insertId,
            google_id: profile.id,
            user_name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
          };

          return done(null, newUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      done(null, rows[0]);
    } catch (err) {
      done(err);
    }
  });
};

module.exports = googleStrategy;
