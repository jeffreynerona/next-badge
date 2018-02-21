import Host from '../model/host';
import md5 from 'md5';

export default (event,client) => {
  var qrdetails = {
    success: false,
    message: 'There was an error with the server. QR never got set. Please contact the administrator',
    code: ''
  };;
    Host.find({
    "event" : event.eventid,
    "endtime" : { $exists: false }
  }, (err, hosts) => {
    if (err) {
      qrdetails = {
        success: false,
        message: 'There was an error with the server. Query Hosts Error. Please contact the administrator.',
        code: '',
        error: err
      };
      client.emit('qrcode', qrdetails);
    } else {
      console.log('search host success');
      if(hosts.length>=1) {
        //found an active host
        //generate qr shit and connect the sockiets(happens in client)
        var toupdate = hosts[hosts.length-1];
        var qrupdated = Date.now().toString();
        var qr = md5(event.eventid.toString() + qrupdated);
        qr = qr.substr(qr.length - 5);
        toupdate.save(err => {
          if (err) {
            qrdetails = {
              success: false,
              message: 'There was an error with the server. Update Host Error. Please contact the administrator',
              code: '',
              error: err
            };
            client.emit('qrcode', qrdetails);
          } else {
            qrdetails = {
              success: true,
              message: 'QR code successfully regenerated.',
              code: qr
            };
            client.emit('qrcode', qrdetails);
          }
        });
      }
      else {
        //no active host, create one
        var now = new Date();
        var end = now;
        var qrupdated = Date.now().toString();
        var qr = md5(event.eventid.toString() + qrupdated);
        qr = qr.substr(qr.length - 5);
        // end.setHours(end.getHours() + 12);
        let newHost = new Host();
        newHost.event = event.eventid;
        newHost.host = event.eventowner;
        newHost.starttime = now.toISOString();
        newHost.qr = qr;
        newHost.save(err => {
          if (err) {
            qrdetails = {
              success: false,
              message: 'Error in creating Host Server',
              code: '',
              error: err
            };
            client.emit('qrcode', qrdetails);
          } else {
            qrdetails = {
              success: true,
              message: 'Successfully created host',
              code: newHost.qr
            };
            client.emit('qrcode', qrdetails);
          }
        });
      }
    }
  });
}