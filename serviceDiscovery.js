import {Bonjour} from 'bonjour-service'

const instance = new Bonjour();

instance.find({ type: 'tms' }, function (service) {
    console.log('Found an http server:', service)
});