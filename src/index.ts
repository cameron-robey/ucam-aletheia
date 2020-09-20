import express, { Request, Response } from 'express';
import fetch from 'node-fetch';

// Data
import instId from './data/instId';

const app = express();

interface lookupInstitution {
  cancelled: boolean,
  instid: string,
  name: string
}

class crsidResponse {
  crsid: string = '';
  name: string = '';
  college: string|undefined = undefined;
  staff: boolean = false;
  student: boolean = false;
  studentStatus: string|undefined = undefined;
}


app.get('/crsid/:crsid', async (req: Request, res: Response) => {
  // Get data from UIS
  const data = await fetch(`https://lookup-test.csx.cam.ac.uk/api/v1/person/crsid/${req.params.crsid}?fetch=all_insts&format=json`);
  const body = await data.json();

  let response = new crsidResponse; 

  if (!body.result) res.status(404).send("User not found.");
  if (!body.result.person) res.status(404).send("User not found.");

  // For students, find college and status

  if (body.result.person.institutions) {
    let insts = body.result.person.institutions.filter( 
      (institution: lookupInstitution) => Object.keys(instId).includes(institution.instid)
    );

    if (insts.length === 0) {
      // Not in any, must be staff, or part of a faculty
    } else if (insts.length === 1) {
      let inst: keyof typeof instId = insts[0].instid;
      response.college = instId[inst].college;
      response.studentStatus = instId[inst].status;
    }
  }

  // Other information
  response.crsid = body.result.person.identifier.value;
  response.name = body.result.person.displayName;
  response.staff = body.result.person.staff;
  response.student = body.result.person.student;

  res.json(response);
});

app.listen(7000, () => {
  console.log('Server started on port 7000');
});