import { useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { FormControl } from "@mui/base";
import AttachmentsUploader from "../../components/AttachmentsUploader";
 /**
   * Renders a text field with a label.
   *
   * @param {string} fieldName - the name of the field
   * @param {string} label - the label text
   * @return {JSX.Element} the rendered text field component
   */
const ProductAccordian = () => {
  const renderTextField = (fieldName = "", label = "") => (
    <FormControl style={{ margin: "5px 5px", width: "100%" }}>
      <label
        htmlFor={`outlined-${label}`}
        style={{ textTransform: "capitalize" }}
      >
        {label}
      </label>
      <TextField id={`outlined-${label}`} name={fieldName} margin="dense" />
    </FormControl>
  );
  const options = ["Option 1", "Option 2", "Option 3"];
  const renderAutocomplete = (
    fieldName = "",
    label = "",
    optionList: Array<any> | undefined
  ) => (
    <FormControl style={{ margin: "5px 5px", width: "100%" }}>
      <label htmlFor={`outlined-${label}`}>{label}</label>
      <Autocomplete
        id={`outlined-${label}`}
        options={optionList ? optionList : []}
        getOptionLabel={(option) => option.name || option.description || option}
        renderInput={(params) => (
          <TextField key={params.id} {...params} placeholder="- Select -" />
        )}
      />
    </FormControl>
  );
  const [attachments, setAttachments] = useState({
    files: [],
    attachmentType: 0,
  });
  const handleAttachChange = (newAttachments: any) => {
    const files = newAttachments.files;
    const attachmentType = newAttachments.attachmentType;
    if ((files && files.length > 0) || attachmentType) {
      setAttachments({ files: files, attachmentType: attachmentType });
    }
  };

  const data = {
    General: ["StockCode", "status", "BaseCode"],
    Attachment: ["Type", "Thumb"],
  };

  const fieldTypeOption: any = {
    StockCode: renderTextField,
    status: renderAutocomplete,
    BaseCode: renderTextField,
    Type: renderTextField,
    Thumb: renderTextField,
  };

  const renderAccordion = (group, fields) => {
    return (
      <>
        <Accordion key={group}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls={`panel-${group}-content`}
            id={`panel-${group}-header`}
          >
            <AddIcon />
            <Typography>{group}</Typography>
          </AccordionSummary>
          <AccordionDetails className="accordian-input-fields">
            {/* {fields.map((field) => {
              console.log(field);
              return renderTextField(field, field);
            })} */}
            {fields.map((field) => {
              const renderFunction = fieldTypeOption[field];
              if (renderFunction) {
                return renderFunction(field, field);
              }
              return null;
            })}
          </AccordionDetails>
        </Accordion>
      </>
    );
  };
  return (
    <div>
      {Object.entries(data).map(([group, fields]) =>
        renderAccordion(group, fields)
      )}

      {/* <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <AddIcon />  
          <Typography>ASSORTMENT FLAGS</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "Stockcode")}
          {renderTextField("stockcode", "Sans Shade Desc")}
          {renderTextField("stockcode", "Family Name")}
          {renderTextField("stockcode", "Prv Short Desc")}
          {renderTextField("stockcode", "Prv Basecode")}
          {renderTextField("stockcode", "Prv Stockcode")}
          {renderTextField("stockcode", "Sandbox Group")}
          {renderTextField("stockcode", "FoutACDesc")}
          {renderAutocomplete("stockcode", "RYT Designer", options)}
          {renderAutocomplete("stockcode", "MKT Designer", options)}
          {renderAutocomplete("stockcode", "Style", options)}
          {renderAutocomplete("stockcode", "Category", options)}
          {renderAutocomplete("stockcode", "Function", options)}
          {renderAutocomplete("stockcode", "Department", options)}
          {renderAutocomplete("stockcode", "Relatives", options)}
          {renderAutocomplete("stockcode", "HardWare Mtr'l", options)}
          {renderAutocomplete("stockcode", "Pri Material", options)}
          {renderAutocomplete("stockcode", "Sec Material", options)}
          {renderAutocomplete("stockcode", "3rd Material", options)}
          {renderAutocomplete("stockcode", "HTS Material", options)}
          {renderAutocomplete("stockcode", "Pri Manuf Mtd", options)}
          {renderAutocomplete("stockcode", "Sec Manuf Mtd", options)}
          {renderAutocomplete("stockcode", "3rd Manuf Mtd", options)}
          {renderAutocomplete("stockcode", "HTS Manuf Mtd", options)}
          {renderTextField("stockcode", "Fact Primary Finish Cd")}
          {renderTextField("stockcode", "Fact Secondary Finish Cd")}
          {renderTextField("stockcode", "3rd Factory Finish Cd")}
          {renderAutocomplete("stockcode", "Pri Finish Cd", options)}
          {renderAutocomplete("stockcode", "Sec Finish Cd", options)}
          {renderAutocomplete("stockcode", "3rd Finish Cd", options)}
          {renderAutocomplete("stockcode", "Hardware Finish", options)}
          {renderTextField("stockcode", "Prj Create Date")}
          {renderTextField("stockcode", "SW3D")}
          {renderTextField("stockcode", "Intro Date")}
          {renderTextField("stockcode", "Export To Sandbox")}
          {renderTextField("stockcode", "Coordinator")}
          {renderTextField("stockcode", "Drawing #")}
          {renderAutocomplete("stockcode", "Base Finish Cd", options)}
          {renderAutocomplete("stockcode", "Base Material", options)}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>CERTIFICATION & COMPLIANCE</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderAutocomplete("stockcode", "SKU Type", options)}
          {renderAutocomplete("stockcode", "SL Type", options)}
          {renderTextField("stockcode", "SL Name")}
          {renderTextField("stockcode", "SL Desc")}
          {renderTextField("stockcode", "Lamp SKU")}
          {renderTextField("stockcode", "Other Comp")}
          {renderAutocomplete("stockcode", "Shade / Glass ?", options)}
          {renderTextField("stockcode", "Shade SKU Cd")}
          {renderTextField("stockcode", "Shade SKU Desc")}
          {renderTextField("stockcode", "Shade Details")}
          {renderTextField("stockcode", "Treatment")}
          {renderTextField("stockcode", "Treatment Type")}
          {renderAutocomplete("stockcode", "Title 20", options)}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>DIMENSIONS</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderAutocomplete("stockcode", "Supplier Name", options)}
          {renderTextField("stockcode", "Factory Item Name")}
          {renderTextField("stockcode", "Fact Shade / Glass Code")}
          {renderTextField("stockcode", "Fact Shade / Glass Treatment")}
          {renderTextField("stockcode", "Assembly")}
          {renderAutocomplete("stockcode", "Packaging", options)}
          {renderTextField("stockcode", "Assembly Detail")}
          {renderAutocomplete("stockcode", "Sub Contract Vendor 1", options)}
          {renderTextField("stockcode", "Sub Cont 1 Factory Item Number")}
          {renderAutocomplete("stockcode", "Sub Contract Vendor 2", options)}
          {renderTextField("stockcode", "Sub Cont 2 Factory Item Number")}
          {renderAutocomplete("stockcode", "Sub Contract Vendor 3", options)}
          {renderTextField("stockcode", "Sub Cont 3 Factory Item Number")}
          {renderAutocomplete("stockcode", "Sub Contract Vendor 4", options)}
          {renderTextField("stockcode", "Sub Cont 4 Factory Item Number")}
          {renderAutocomplete("stockcode", "Certification", options)}
          {renderAutocomplete("stockcode", "Testing", options)}
          {renderTextField("stockcode", "Sample Qty Req")}
          {renderTextField("stockcode", "Request Date")}
          {renderTextField("stockcode", "Photoshop Sample Qty Req")}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>ENGINEERING</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "Height")}
          {renderTextField("stockcode", "Width")}
          {renderTextField("stockcode", "Extension")}
          {renderTextField("stockcode", "Wattage")}
          {renderTextField("stockcode", "Size ")}
          {renderTextField("stockcode", "Base ")}
          {renderTextField("stockcode", "Canopy")}
          {renderTextField("stockcode", "Canopy Height")}
          {renderTextField("stockcode", "Canopy Width")}
          {renderAutocomplete("stockcode", "Harp", options)}
          {renderAutocomplete("stockcode", "Riser", options)}
          {renderAutocomplete("stockcode", "Finial", options)}
          {renderTextField("stockcode", "Backplate")}
          {renderTextField("stockcode", "Light Qty")}
          {renderTextField("stockcode", "Socket Detail")}
          {renderTextField("stockcode", "Socket Detail 1")}
          {renderTextField("stockcode", "Wiring Dtl")}
          {renderAutocomplete("stockcode", "Light Source", options)}
          {renderAutocomplete("stockcode", "Socket Type", options)}
          {renderAutocomplete("stockcode", "Socket", options)}
          {renderAutocomplete("stockcode", "Wiring", options)}
          {renderAutocomplete("stockcode", "Switch", options)}
          {renderAutocomplete("stockcode", "Bulb Shape", options)}
          {renderTextField("stockcode", "Fixture Height")}
          {renderTextField("stockcode", "Height As Shown")}
          {renderTextField("stockcode", "Minimum Height")}
          {renderTextField("stockcode", "Overall Height")}
          {renderTextField("stockcode", "LED Lumens / Color Temp")}
          {renderTextField("stockcode", "Chain / Rod Lgth")}
          {renderTextField("stockcode", "Rod Shape")}
          {renderTextField("stockcode", "Chain")}
          {renderTextField("stockcode", "Break Count")}
          {renderTextField("stockcode", "Break Length")}
          {renderTextField("stockcode", "Rod Count")}
          {renderTextField("stockcode", "Rod Dia.")}
          {renderAutocomplete("stockcode", "LED Type", options)}
          {renderAutocomplete("stockcode", "LED Driver Type", options)}
          {renderAutocomplete("stockcode", "LED Dimming Type", options)}
          {renderAutocomplete("stockcode", "Certification Type", options)}
          {renderAutocomplete("stockcode", "Certification Note", options)}
          {renderAutocomplete("stockcode", "JBox", options)}
          {renderAutocomplete("stockcode", "Mounting", options)}
          {renderAutocomplete("stockcode", "Chain Link", options)}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>FEATURES</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "Stockcode")}
          {renderTextField("stockcode", "Short Description")}
          {renderAutocomplete("stockcode", "Status", options)}
          {renderAutocomplete("stockcode", "Stage", options)}
          {renderAutocomplete("stockcode", "Category", options)}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>FLAGS FOR FUNCTIONALITY</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "Stockcode")}
          {renderTextField("stockcode", "Short Description")}
          {renderAutocomplete("stockcode", "Status", options)}
          {renderAutocomplete("stockcode", "Stage", options)}
          {renderAutocomplete("stockcode", "Category", options)}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>ITEM</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "Basecode")}
          {renderTextField("stockcode", "Basecode Intro Date")}
          {renderAutocomplete("stockcode", "Brand Collection", options)}
          {renderAutocomplete("stockcode", "Brand Collection Name", options)}
          {renderAutocomplete("stockcode", "Department ", options)}
          {renderAutocomplete("stockcode", "Designer", options)}
          {renderAutocomplete("stockcode", "Family ", options)}
          {renderAutocomplete("stockcode", "Function", options)}
          {renderAutocomplete("stockcode", "IMAP", options)}
          {renderTextField("stockcode", "Imap Price")}
          {renderTextField("stockcode", "Item Code")}
          {renderAutocomplete("stockcode", "Last Call", options)}
          {renderAutocomplete("stockcode", "Last Call Aprice", options)}
          {renderTextField("stockcode", "Last Call Imap")}
          {renderTextField("stockcode", "Part Code")}
          {renderTextField("stockcode", "Part Description")}
          {renderTextField("stockcode", "Part Name")}
          {renderTextField("stockcode", "PD BASECODE")}
          {renderTextField("stockcode", "PD STOCKCODE")}
          {renderTextField("stockcode", "Product Basecode")}
          {renderAutocomplete("stockcode", "Product Class", options)}
          {renderAutocomplete("stockcode", "Reporting Brand", options)}
          {renderAutocomplete("stockcode", "Royalty Code", options)}
          {renderTextField("stockcode", "Series Description")}
          {renderAutocomplete("stockcode", "Series Id", options)}
          {renderTextField("stockcode", "Series Name")}
          {renderTextField("stockcode", "Short Description")}
          {renderTextField("stockcode", "Short Item Number")}
          {renderTextField("stockcode", "SL Intro Date")}
          {renderAutocomplete("stockcode", "Status", options)}
          {renderTextField("stockcode", "Stock Code")}
          {renderTextField("stockcode", "UPC")}
          {renderTextField("stockcode", "URL")}
          {renderTextField("stockcode", "Basecode Description")}
          {renderAutocomplete("stockcode", "Brand Collection", options)}
          {renderAutocomplete("stockcode", "Brand Collection Code", options)}
          {renderAutocomplete("stockcode", "Category", options)}
          {renderAutocomplete("stockcode", "Class ", options)}
          {renderAutocomplete("stockcode", "Country Of Origin", options)}
          {renderTextField("stockcode", "Description")}
          {renderTextField("stockcode", "DN Price")}
          {renderTextField("stockcode", "Doc Name")}
          {renderAutocomplete(
            "stockcode",
            "Selling Line In Stock Date",
            options
          )}

          <AttachmentsUploader
            title="Upload pdf, doc, docx, jpg, jpeg, png"
            onChange={handleAttachChange}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />
          <Typography>LAMPING</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderAutocomplete("stockcode", "Filter By Type", options)}
          {renderTextField("stockcode", "Search Notes")}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>MANUFACTURING DETAILS</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "Project Notes")}
          {renderTextField("stockcode", "Samples Notes")}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>MARKETING</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "High Point")}
          {renderAutocomplete("stockcode", "Display", options)}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>MATERIAL/FINISH DETAILS</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "Sample Request Completion Date")}
          {renderTextField("stockcode", "Sample Projected Completion Date")}
          {renderTextField("stockcode", "Sample Confirmed Completion Date")}
          {renderTextField("stockcode", "Sample Actual Completion Date")}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>PACKAGING AND WEIGHTS</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "Sample Request Completion Date")}
          {renderTextField("stockcode", "Sample Projected Completion Date")}
          {renderTextField("stockcode", "Sample Confirmed Completion Date")}
          {renderTextField("stockcode", "Sample Actual Completion Date")}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>PERFORMANCE</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "Sample Request Completion Date")}
          {renderTextField("stockcode", "Sample Projected Completion Date")}
          {renderTextField("stockcode", "Sample Confirmed Completion Date")}
          {renderTextField("stockcode", "Sample Actual Completion Date")}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>PRODUCT DETAILS</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "Sample Request Completion Date")}
          {renderTextField("stockcode", "Sample Projected Completion Date")}
          {renderTextField("stockcode", "Sample Confirmed Completion Date")}
          {renderTextField("stockcode", "Sample Actual Completion Date")}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>QUALITY</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "Sample Request Completion Date")}
          {renderTextField("stockcode", "Sample Projected Completion Date")}
          {renderTextField("stockcode", "Sample Confirmed Completion Date")}
          {renderTextField("stockcode", "Sample Actual Completion Date")}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>REPORTING</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "Basecode Rank")}
          {renderTextField("stockcode", "Selling Line Rank")}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AddIcon />  
          <Typography>VENDOR</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-input-fields">
          {renderTextField("stockcode", "Sample Request Completion Date")}
          {renderTextField("stockcode", "Sample Projected Completion Date")}
          {renderTextField("stockcode", "Sample Confirmed Completion Date")}
          {renderTextField("stockcode", "Sample Actual Completion Date")}
        </AccordionDetails>
      </Accordion> */}
    </div>
  );
};
export default ProductAccordian;
