import time

SESSION_TTL = 300  # seconds


def refresh_session(store, session_id):
    session = store.get(session_id)
    if session is None:
        return None
    if session["expires_at"] < time.time():
        store.delete(session_id)
        return None
    new_id = store.rotate_id(session_id)
    session["expires_at"] = time.time() + SESSION_TTL
    try:
        store.save(new_id, session)
    except Exception:
        pass
    return new_id
