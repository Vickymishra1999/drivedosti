//Olyverto20@1999 =passw
//mishravicky0141=usrn

const mongoose=require('mongoose');
const MONGO_URI='mongodb+srv://mishravicky0141:Zzj0gk18hAFopMLS@cluster0.th3hfpm.mongodb.net/krishna'

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
