import AttachmentsUploader from "../components/AttachmentsUploader";

export default function AttachmentTest(){

    const handleFileSelection = (attachments) => {
        console.log(attachments);
    }

    return (
        <AttachmentsUploader 
            title="Select Attachment File(s)"
            onChange={handleFileSelection} ></AttachmentsUploader>
    );
}