export const emptyForm = {
  employeeId: "",
  facultyName: "",
  designation: "",
  gender: "Male",
  category: "OC",
  dateOfBirth: "",
  highestQualification: "Ph.D",
  highestQualificationOther: "",
  qualificationSpecialization: "",
  pgQualification: "M.Tech",
  ugStudyDetails: "",
  pgStudyDetails: "",
  phdStudyDetails: "",
  phdThesisStatus: "",
  stateOfDomicile: "ANDHRA PRADESH",
  stateOfDomicileOther: "",
  dateOfJoining: "",
  klUniversityExperience: "",
  industrialExperience: "",
  totalExperience: "",
  aadharNo: "",
  panNo: "",
  researchLevel: "L0",
  researchLevelOther: "",
  country: "INDIA",
  countryOther: "",
  netSetSlet: ""
};

export function createEmptyForm() {
  return { ...emptyForm };
}
