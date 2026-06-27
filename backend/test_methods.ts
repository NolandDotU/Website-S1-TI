import { LecturerService } from "./src/api/v1/lecturer/lecturer.service";

const lecturerService = new LecturerService();
console.log("getUserByParam exists:", !!lecturerService['userService'].getUserByParam);
console.log("newUser exists:", !!lecturerService['userService'].newUser);
