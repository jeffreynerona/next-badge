import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializeDb from '../db';
import badge from '../controller/badge';
import user from '../controller/user';
import event from '../controller/event';
import host from '../controller/host';

let router = express();

//connect to db
initializeDb(db=> {

	//internal middleware
	router.use(middleware({config, db}));

	//api routes v1
	router.use('/badge', badge({ config, db }));
	router.use('/user', user({ config, db }));
	router.use('/event', event({ config, db }));
	router.use('/host', host({ config, db }));

});

export default router;