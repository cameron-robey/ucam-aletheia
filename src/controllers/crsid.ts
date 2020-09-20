import { Request, Response } from 'express';
import fetch from 'node-fetch';

// Data
import instIdStudent from './../data/instIdStudent';
import instIdStaff from './../data/instIdStaff';

interface lookupInstitution {
  cancelled: boolean,
  instid: string,
  name: string
}

class crsidResponse {
  crsid: string = '';
  name: string = '';
  current: boolean|undefined = undefined;
  college: string|undefined = undefined;
  staff: boolean|undefined = undefined;
  student: boolean|undefined = undefined;
  studentStatus: string|undefined = undefined;
}

export const getCrsid = async (req: Request, res: Response) => {
  // Get data from UIS
  const data = await fetch(`https://lookup-test.csx.cam.ac.uk/api/v1/person/crsid/${req.params.crsid}?fetch=all_insts&format=json`);
  const body = await data.json();

  let response = new crsidResponse; 

  if (!body.result) { res.status(404).json({error: 'User not found'}); return; }
  if (!body.result.person) { res.status(404).json({error: "User not found."}); return; }

  // Institution searching - students and staff
  if (body.result.person.institutions) {
    if (body.result.person.student) {
      // Get college and status (undergrad/postgrad) for students
      
      let insts = body.result.person.institutions.filter( 
        (institution: lookupInstitution) => Object.keys(instIdStudent).includes(institution.instid)
      );
        
      if (insts.length === 0) {
        // Not in any, must be private, or part of a faculty
      } else if (insts.length === 1) {
        let inst: keyof typeof instIdStudent = insts[0].instid;
        response.college = instIdStudent[inst].college;
        response.studentStatus = instIdStudent[inst].status;
      }
    } else if (body.result.person.staff) {
      // Get college if applicable for staff
      // NOTE: not all staff affiliated with a college
      
      let insts = body.result.person.institutions.filter( 
        (institution: lookupInstitution) => Object.keys(instIdStaff).includes(institution.instid)
      );
      
      if (insts.length === 0) {
        // Not in any, must not be associated with a college
      } else if (insts.length === 1) {
        let inst: keyof typeof instIdStaff = insts[0].instid;
        response.college = instIdStaff[inst].college;
      }
    }
  }

  // Check if currently at univeristy
  response.current = !body.result.person.cancelled;

  // Other information
  response.crsid = body.result.person.identifier.value;
  response.name = body.result.person.displayName;
  response.staff = body.result.person.staff;
  response.student = body.result.person.student;

  res.json(response);
}