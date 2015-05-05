# ITWS-4200 Web Science Project

# Project Summary
This project, called “On Point,” is a social travel platform that allows people to share their insider knowledge of cities around the world, showcasing their picks of everything from the classic must-do’s to the up-and-coming hidden alleyways.  On Point’s target users are curious travelers who visit cities and want to wander like a local as well as people who enjoy traveling and sharing their recommendations.

As a traveler, you can explore the curated lists of cities to plan your next trip or virtually travel to your next dream spot. Travel books are antiquated and for the most part, advocate for the same tourist traps. Tapping into locals’ knowledge and the spirit of the adventurous traveler, this tool will improve the traveling experience. 

Using a standard user account system as a foundation, users will have profiles where they can showcase cities and list parks, restaurants, viewpoints, cafés, and more within each city listing.  On Point is an ecosystem of quality curations of what’s good around the world where users can follow fellow travelers for inspiration.  Listings will gather supplemental media from Instagram and Yelp to provide relevant information to users.

On Point intends to become a local-oriented valuable information source for traveling recommendations and a social platform to curate featured points and interest sharing. 

Emily Roth
rothe2@rpi.edu

Devin Nguyen
nguyed5@rpi.edu

Pinyuan(Doris) Xian
xianp@rpi.edu

Jonathan Yax
yaxarj@rpi.edu

Aidan Pelisson
pelisa@rpi.edu

## Installation

First, run <code>npm install</code> to install the NPM dependencies.

To start the application, run <code>npm start</code>.

On the server-side, run <code>PORT=80 npm start</code> to set the express server port to default 80.  Otherwise, the default port will result in the app's running on localhost:5000.

## Mongo Database

Our application uses the name <code>onpoint-dev</code> for the mongo database.

A copy of all the default supported cities and a collection of sample points are included in a mongodump at <code>dump/onpoint-dev</code>.  To use this, make sure there is no local copy of a mongodb called <code>onpoint-dev</code> and just run <code>mongorestore</code> in the repo's directory to load the mongodump.

## Social Media Integration

As our application is not registered on the Facebook Developer Platform yet, the passport.JS integration with Facebook will only work on a local running copy of the application and not on our live site.

### Live Version

A sandbox/live version of our application is developed and live at [http://onpoint.devinnguyen.com/](http://onpoint.devinnguyen.com/)