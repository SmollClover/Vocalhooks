# Vocalhooks

### A Simple Webserver that's designed to listen for requests and then do certain Actions defined in a file

> This Project was designed for personal use. There's no guarantee for it to be stable when used by someone else

---

## ToDo List

-   [x] Webserver
    -   [x] Start Express app
    -   [x] Listen on default Port 3000
    -   [x] Listen if action URL is called
-   [ ] Actions
    -   [ ] Have a Actions directory in project root
    -   [ ] One Action in each file
    -   [ ] Specify Name and Version in file
    -   [ ] TOML File with a template one
-   [ ] Parser
    -   [ ] Parse Action TOML
    -   [ ] Parse Config TOML
-   [ ] Config
    -   [ ] Load Config from project root
    -   [ ] Write default confg if not exist
-   [ ] File Handler
    -   [ ] Read file and handle update events
    -   [ ] Register handler to listen for file update events
