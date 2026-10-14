# Event Data

Required fields:

- timestamp
- deviceId
- type
- name

## Event Types

{subject}/{action}

- user/click
- user/longpress
- page/opened
- dialog/opened
- dialog/closed

- api/succeeded
- api/aborted
- api/failed
- sse_con/opened
- sse_con/closed
- (sse_con/failed)
- sse_msg/succeeded
- sse_msg/failed

### API events

"api/failed" payload must include "errorStage" attribute.

- "request_encode"
- "fetch"
- "response_read"
- "response_decode"
- "response_validation"

### SSE events

- bottle/rfids
- bottle/weights
- flow/level
- overflow/status
- etc.
