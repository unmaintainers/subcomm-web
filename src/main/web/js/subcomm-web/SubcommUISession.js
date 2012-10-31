function SubcommUISession() {
    this.hostname = null;
    this.port = null;
    this.username = null;
    this.password = null;
    this.containerId = null;
    this.uri = null;
    /* @var boolean TRUE if a subcommConnect message has been sent out. FALSE otherwise. */
    this.introduced = false;
}