export default {

    getMimeType(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'svg':
            return 'image/svg+xml';
        case 'pdf':
            return 'application/pdf';
        case 'doc':
        case 'docx':
            return 'application/msword';
        case 'xls':
        case 'xlsx':
            return 'application/vnd.ms-excel';
        case 'ppt':
        case 'pptx':
            return 'application/vnd.ms-powerpoint';
        case 'zip':
            return 'application/zip';
        case 'txt':
            return 'text/plain';
        case 'csv':
            return 'text/csv';
        // Add additional cases for other file types as needed
        default:
            return 'application/octet-stream';
    }
}

}
