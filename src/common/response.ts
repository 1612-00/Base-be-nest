import HttpStatusCode from "src/shared/statusCode.enum";

export default function responseS5M(statusCode:HttpStatusCode, data ? : any, messageClient?:string, messageBackend?:string){
    return {
        "STATUS_CODE": statusCode,
        "MESSAGE_BACKEND": messageBackend,
        "MESSAGE_CLIENT": messageClient,
        "META_DATA" : data
    };
}
