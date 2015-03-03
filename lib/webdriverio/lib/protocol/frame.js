/**
 * Change focus to another frame on the page. If the frame id is null,
 * the server should switch to the page's default content.
 *
 * @param {String|Number|null|WebElement JSON Object} id   Identifier for the frame to change focus to.
 *
 * @see  https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/frame
 * @type protocol
 *
 */

module.exports = function frame (frameId) {
    // by guxia, change the method to POST
    var commandOptions =  {
        path: "/session/:sessionId/frame",
        method: "POST"
    };
    /*!
     * parameter check
     */
    if (arguments.length === 1 || typeof frameId === 'function') {
        frameId  = null;
    }
    //console.log("=====frame ID: ", frameId);

    this.requestHandler.create(
        commandOptions,
        {id: frameId},
        arguments[arguments.length - 1]
    );

};
