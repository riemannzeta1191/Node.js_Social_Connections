// code to create a class of connection and it's each instance variable

class connection {
    
    constructor(connection_ID, connection_name , connection_topic, details, date, location,time,hosted_by,rsvp) {
        this._connection_ID = connection_ID;
        this._connection_name  = connection_name ;
        this._connection_topic = connection_topic;
        this._details = details;
        this._date = date;
        this._location = location;
        this._time = time;
        this._hosted_by = hosted_by;
        this._rsvp = rsvp;
    }
    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get time() {
        return this.time;
    }

    set time(value) {
        this.time = value;
    }

    get connection_ID() {
        return this._connection_ID;
    }

    set connection_ID(value) {
        this._connection_ID = value;
    }

    get connection_name () {
        return this._connection_name ;
    }

    set connection_name (value) {
        this._connection_name  = value;
    }

    get connection_topic() {
        return this._connection_topic;
    }

    set connection_topic(value) {
        this._connection_topic = value;
    }

    get details() {
        return this._details;
    }

    set details(value) {
        this._details = value;
    }

    get location() {
        return this._location;
    }

    set location(value) {
        this._location = value;
    }

    get hosted_by() {
        return this._hosted_by;
    }

    set hosted_by(value) {
        this._hosted_by = value;
    }

    get rsvp() {
        return this._rsvp;
    }

    set rsvp(value) {
        this._rsvp = value;
    }

   

}

module.exports = connection;
