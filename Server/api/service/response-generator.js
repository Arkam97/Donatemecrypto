var headers = {
  "Content-Type": "application/json",
  // "Access-Control-Allow-Methods": "DELETE,PUT,POST,GET,OPTIONS",
  "Access-Control-Allow-Origin": "*",
  // "Cache-Control": "no-cache, no-store, must-revalidate"
};

class ResponseFactory {

  constructor(statusCode, body) {
    this.statusCode = statusCode;
    this.body = JSON.stringify(body);
  }
}

export function createResponse(
  statusCode,
  body
) {
  return new ResponseFactory(statusCode, body);
}
