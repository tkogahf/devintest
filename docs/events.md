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
- api/failed
- sse_con/opened
- sse_con/closed
- (sse_con/failed)
- sse_msg/succeeded
- sse_msg/failed

### API events

"api/failed" payload must include "errorStage" attribute.

- "fetch"
- "response_read"
- "content_type"
- "body_decode"
- "schema_validation"

### SSE events

- bottle/rfids
- bottle/weights
- flow/level
- overflow/status
- etc.
