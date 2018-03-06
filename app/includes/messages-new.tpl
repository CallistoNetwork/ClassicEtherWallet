<div>
    <form ng-submit="handleSubmitNewMessage($event)">
        <label for="message">Message</label>
        <textarea rows="5"
                  class="form-control"
                  name="message"
                  id="message"
        >

        </textarea>
        <button class="btn btn-primary" type="submit">
            Send
        </button>
    </form>
</div>
