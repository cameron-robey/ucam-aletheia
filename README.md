# ucam-aletheia

Typescript gateway to the University of Cambridge Lookup Service. In order to access the Lookup Service, the deployment needs to be inside of the CUDN.

## Installation:
**Development:**
```
npm install
npm run start:dev
```
**Deployment:**
```
npm run build
npm start
```

## Routes:

### By crsid:
**Query url:**
```
/crsid/:crsid
```

**Response object:**
```
crsid:	crsid of user
name: display name of user
current: whether the user's account currently active (i.e. false for alumni)
college: college, if applicable
staff: staff status
student: student status
studentStatus: undergraduate or postagraduate (if student)
```
