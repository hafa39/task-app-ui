import fileService from "@/services/files";
import axios from "axios";

export default {
    createBlobUrl(attachment) {
        const byteCharacters = atob(attachment.content);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        let mimeType = fileService.getMimeType(attachment.fileName)
        let blob = new Blob([byteArray], {type: mimeType});

        attachment.dataUrl = URL.createObjectURL(blob)
    },

    add(formData,cardId){
        return axios.post('/attachments' ,formData, {
            params: {
                cardId: cardId  // Assuming boardId is the value you want to use as a query parameter
            },
            headers: { 'Content-Type': 'multipart/form-data' }})
    },

    getCardAttachments(cardId){
      return axios.get('/attachments', {
          params: {
              cardId: cardId  // Assuming boardId is the value you want to use as a query parameter
          }
      } )
    },

    removeAttachment(id){
        return axios.delete('/attachments/'+id)
    }
}
