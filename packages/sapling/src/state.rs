

pub struct State {
    is_initialized: bool
}

impl State {
    pub fn is_initialized() -> bool {
        unsafe { STATE.is_initialized }
    }

    pub fn set_initialized() {
        unsafe { STATE.is_initialized = true; }
    }
}

static mut STATE: State = State {
    is_initialized: false,
};