import { Save } from "lucide-react";
import { calculateExperience } from "../utils/experience";

export default function FacultyForm({ form, setForm, onSubmit, status }) {
  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateJoiningDate = (value) => {
    setForm((current) => ({
      ...current,
      dateOfJoining: value,
      klUniversityExperience: calculateExperience(value),
    }));
  };

  return (
    <form className="detail-form" onSubmit={onSubmit}>
      <div className="form-section-title">Faculty Information</div>
      <div className="form-grid">
        <label>
          <div>
            Employee ID <span className="required-asterisk">*</span>
          </div>
          <input
            required
            type="text"
            readOnly
            value={form.employeeId || ""}
            placeholder="Enter employee ID"
          />
        </label>
        <label>
          <div>
            Name of the faculty as per SSC{" "}
            <span className="required-asterisk">*</span>
          </div>
          <input
            required
            value={form.facultyName || ""}
            onChange={(event) => update("facultyName", event.target.value)}
            placeholder="Enter faculty name"
          />
        </label>
        <label>
          <div>
            Designation <span className="required-asterisk">*</span>
          </div>
          <select
            required
            value={form.designation || "Professor"}
            onChange={(event) => update("designation", event.target.value)}
          >
            <option>Professor</option>
            <option>Assoc. Professor</option>
            <option>Asst. Professor</option>
          </select>
        </label>
        <label>
          <div>
            Gender <span className="required-asterisk">*</span>
          </div>
          <select
            required
            value={form.gender || "Male"}
            onChange={(event) => update("gender", event.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </label>
        <label>
          <div>
            Category <span className="required-asterisk">*</span>
          </div>
          <select
            required
            value={form.category || "OC"}
            onChange={(event) => update("category", event.target.value)}
          >
            <option>OC</option>
            <option>OBC</option>
            <option>SC</option>
            <option>ST</option>
          </select>
        </label>
        <label>
          <div>
            Date of Birth <span className="required-asterisk">*</span>
          </div>
          <input
            required
            type="date"
            value={form.dateOfBirth || ""}
            onChange={(event) => update("dateOfBirth", event.target.value)}
          />
        </label>
      </div>

      <div className="form-section-title">Qualification Details</div>
      <div className="form-grid">
        <label>
          <div>
            PG Qualification <span className="required-asterisk">*</span>
          </div>
          <select
            required
            value={form.pgQualification || "M.Tech"}
            onChange={(event) => update("pgQualification", event.target.value)}
          >
            <option>M.Tech</option>
            <option>MCA</option>
            <option>M.Sc</option>
          </select>
        </label>

        <label>
          <div>
            Highest qualification <span className="required-asterisk">*</span>
          </div>
          <select
            required
            value={form.highestQualification || "Ph.D"}
            onChange={(event) =>
              update("highestQualification", event.target.value)
            }
          >
            <option>Ph.D</option>
            <option>M.Tech</option>
            <option>Other</option>
          </select>
        </label>
        {form.highestQualification === "Other" && (
          <label>
            <div>
              Other highest qualification{" "}
              <span className="required-asterisk">*</span>
            </div>
            <input
              required
              value={form.highestQualificationOther || ""}
              onChange={(event) =>
                update("highestQualificationOther", event.target.value)
              }
              placeholder="Specify qualification"
            />
          </label>
        )}
      </div>
      <label>
        <div>
          Highest Qualification Specialization with specific domain{" "}
          <span className="required-asterisk">*</span>
        </div>
        <input
          required
          value={form.qualificationSpecialization || ""}
          onChange={(event) =>
            update("qualificationSpecialization", event.target.value)
          }
          placeholder="Example: CSE / IT"
        />
      </label>
      <label>
        <div>
          Faculty studied UG in NITs / IITs / Central / State / Deemed
          Universities / KLEF <span className="required-asterisk">*</span>
        </div>
        <textarea
          required
          value={form.ugStudyDetails || ""}
          onChange={(event) => update("ugStudyDetails", event.target.value)}
          placeholder="Specify UG University details(JNTUK/Andhra University/Other)"
          rows="3"
        />
      </label>
      <label>
        <div>
          Faculty studied PG in NITs / IITs / Central / State / Deemed
          Universities / KLEF <span className="required-asterisk">*</span>
        </div>
        <textarea
          required
          value={form.pgStudyDetails || ""}
          onChange={(event) => update("pgStudyDetails", event.target.value)}
          placeholder="Specify UG University details(JNTUK/Andhra University/Other)"
          rows="3"
        />
      </label>
      <label>
        <div>
          Faculty studied Ph.D in NITs / IITs / Central / State / Deemed
          Universities / KLEF <span className="required-asterisk">*</span>
        </div>
        <textarea
          required
          value={form.phdStudyDetails || ""}
          onChange={(event) => update("phdStudyDetails", event.target.value)}
          placeholder="Specify UG University details(JNTUK/Andhra University/Other)"
          rows="3"
        />
      </label>
      <label>
        <div>
          Ph.D Thesis submitted / Awarded in this month{" "}
          <span className="required-asterisk">*</span>
        </div>
        <textarea
          required
          value={form.phdThesisStatus || ""}
          onChange={(event) => update("phdThesisStatus", event.target.value)}
          placeholder="If yes, specify details. If no, enter No."
          rows="3"
        />
      </label>

      <div className="form-section-title">Experience and Identity</div>
      <div className="form-grid">
        <label>
          <div>
            State of Domicile <span className="required-asterisk">*</span>
          </div>
          <select
            required
            value={form.stateOfDomicile || "ANDHRA PRADESH"}
            onChange={(event) => update("stateOfDomicile", event.target.value)}
          >
            <option>ANDHRA PRADESH</option>
            <option>ARUNACHAL PRADESH</option>
            <option>ASSAM</option>
            <option>BIHAR</option>
            <option>CHHATTISGARH</option>
            <option>GOA</option>
            <option>GUJARAT</option>
            <option>HARYANA</option>
            <option>HIMACHAL PRADESH</option>
            <option>JHARKHAND</option>
            <option>KARNATAKA</option>
            <option>KERALA</option>
            <option>MADHYA PRADESH</option>
            <option>MAHARASHTRA</option>
            <option>MANIPUR</option>
            <option>MEGHALAYA</option>
            <option>MIZORAM</option>
            <option>NAGALAND</option>
            <option>ODISHA</option>
            <option>PUNJAB</option>
            <option>RAJASTHAN</option>
            <option>SIKKIM</option>
            <option>TAMIL NADU</option>
            <option>TELANGANA</option>
            <option>TRIPURA</option>
            <option>UTTAR PRADESH</option>
            <option>UTTARAKHAND</option>
            <option>WEST BENGAL</option>
            <option>ANDAMAN AND NICOBAR ISLANDS</option>
            <option>CHANDIGARH</option>
            <option>DADRA AND NAGAR HAVELI AND DAMAN AND DIU</option>
            <option>LAKSHADWEEP</option>
            <option>DELHI</option>
            <option>PUDUCHERRY</option>
            <option>LADAKH</option>
            <option>JAMMU AND KASHMIR</option>
            <option>Other</option>
          </select>
        </label>
        {form.stateOfDomicile === "Other" && (
          <label>
            <div>
              Other state <span className="required-asterisk">*</span>
            </div>
            <input
              required
              value={form.stateOfDomicileOther || ""}
              onChange={(event) =>
                update("stateOfDomicileOther", event.target.value)
              }
              placeholder="Specify state"
            />
          </label>
        )}
        <label>
          <div>
            Date Of Joining <span className="required-asterisk">*</span>
          </div>
          <input
            required
            type="date"
            value={form.dateOfJoining || ""}
            onChange={(event) => updateJoiningDate(event.target.value)}
          />
        </label>
        <label>
          <div>
            KL University Experience{" "}
            <span className="required-asterisk">*</span>
          </div>
          <input
            required
            value={form.klUniversityExperience || ""}
            onChange={(event) =>
              update("klUniversityExperience", event.target.value)
            }
            placeholder="Example: 1.4 - 1 year 4 months"
          />
        </label>
        <label>
          <div>
            Industrial Experience <span className="required-asterisk">*</span>
          </div>
          <input
            required
            value={form.industrialExperience || ""}
            onChange={(event) =>
              update("industrialExperience", event.target.value)
            }
            placeholder="Example: 1.4 - 1 year 4 months"
          />
        </label>
        <label>
          <div>
            Total Experience <span className="required-asterisk">*</span>
          </div>
          <input
            required
            value={form.totalExperience || ""}
            onChange={(event) => update("totalExperience", event.target.value)}
            placeholder="Example: 1.4 - 1 year 4 months"
          />
        </label>
        <label>
          <div>
            AADHAR NO <span className="required-asterisk">*</span>
          </div>
          <input
            required
            value={form.aadharNo || ""}
            onChange={(event) => update("aadharNo", event.target.value)}
            placeholder="Enter AADHAR number"
            validationMessage="Please enter a valid AADHAR number"
            validationPattern="^\d{12}$"
          />
        </label>
        <label>
          <div>
            PAN NO <span className="required-asterisk">*</span>
          </div>
          <input
            required
            value={form.panNo || ""}
            onChange={(event) =>
              update("panNo", event.target.value.toUpperCase())
            }
            placeholder="Enter PAN number"
            validationMessage="Please enter a valid PAN number"
            validationPattern="^[A-Z]{5}[0-9]{4}[A-Z]$"/>
        </label>
      </div>

      <div className="form-section-title">Research and Eligibility</div>
      <div className="form-grid">
        <label>
          <div>
            Research Level <span className="required-asterisk">*</span>
          </div>
          <select
            required
            value={form.researchLevel || "L0"}
            onChange={(event) => update("researchLevel", event.target.value)}
          >
            <option>L0</option>
            <option>L1</option>
            <option>L2</option>
            <option>L3</option>
            <option>L4</option>
            <option>Other</option>
          </select>
        </label>
        {form.researchLevel === "Other" && (
          <label>
            <div>
              Other research level <span className="required-asterisk">*</span>
            </div>
            <input
              required
              value={form.researchLevelOther || ""}
              onChange={(event) =>
                update("researchLevelOther", event.target.value)
              }
              placeholder="Specify research level"
            />
          </label>
        )}
        <label>
          <div>
            Country <span className="required-asterisk">*</span>
          </div>
          <select
            required
            value={form.country || "INDIA"}
            onChange={(event) => update("country", event.target.value)}
          >
            <option>INDIA</option>
            <option>Other</option>
          </select>
        </label>
        {form.country === "Other" && (
          <label>
            <div>
              Other country <span className="required-asterisk">*</span>
            </div>
            <input
              required
              value={form.countryOther || ""}
              onChange={(event) => update("countryOther", event.target.value)}
              placeholder="Specify country"
            />
          </label>
        )}
      </div>
      <label>
        <div>
          Faculty Qualified in NET / SET / SLET{" "}
          <span className="required-asterisk">*</span>
        </div>
        <textarea
          required
          value={form.netSetSlet || ""}
          onChange={(event) => update("netSetSlet", event.target.value)}
          placeholder="Specify qualification details or enter No"
          rows="3"
        />
      </label>
      <div className="form-actions">
        <button className="primary-button" type="submit">
          <Save size={18} />
          Save
        </button>
        {status && <span className="status-text">{status}</span>}
      </div>
    </form>
  );
}
