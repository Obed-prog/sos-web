/* ════════════════════════════════════════════════════════════
   SOS CHURCH — SITE UPDATE FORM · one-time setup script
   ════════════════════════════════════════════════════════════
   This creates the Google Form the church uses to post
   announcements and events to the website — no code, no logins
   to anything technical, just a form on a phone.

   HOW TO RUN IT (once, ~3 minutes, from the church's Google
   account so the church owns everything):

   1. Go to  https://script.google.com  → "New project".
   2. Delete whatever is in the editor and paste THIS WHOLE FILE.
   3. Press the disk icon (save), then press "Run".
      Google will ask for permission — allow it (it's your own
      account creating your own form and sheet).
   4. Open the "Execution log". It prints three links:
         · FILL (share this one with whoever posts updates)
         · EDIT (to change the form's questions later)
         · SHEET (where the answers land)
   5. Open the SHEET link → the "Form Responses 1" tab →
      File → Share → Publish to web → choose "Form Responses 1"
      and "Comma-separated values (.csv)" → Publish → copy the link.
   6. In the website's script.js, paste that link into
         var CONTENT_SHEET_CSV = '';
      between the quotes. Done — forever.

   FROM THEN ON: filling the form is the only way anyone updates
   news and events. The site shows the three soonest events that
   haven't passed, and the three newest announcements.
   ════════════════════════════════════════════════════════════ */

function createSiteUpdateForm() {
  /* the form itself */
  var form = FormApp.create('SOS Church — site update');
  form.setDescription(
    'Post an announcement or an upcoming event to the church website.\n' +
    'It appears on the site the next time someone opens the page.'
  );
  form.setCollectEmail(false);

  form.addMultipleChoiceItem()
      .setTitle('What is this?')
      .setChoiceValues(['Announcement', 'Event'])
      .setRequired(true);

  form.addTextItem()
      .setTitle('Title')
      .setHelpText('Short and plain, e.g. "Fellowship meal" or "New midweek study begins".')
      .setRequired(true);

  form.addDateItem()
      .setTitle('Date')
      .setHelpText('For an event: the day it happens. For an announcement: today.')
      .setRequired(true);

  form.addParagraphTextItem()
      .setTitle('Details')
      .setHelpText('One short line shown under the title, e.g. "After morning service — bring a dish if you can."')
      .setRequired(true);

  /* the sheet the answers land in — the website reads this */
  var ss = SpreadsheetApp.create('SOS Church site content');
  ss.setSpreadsheetLocale('en_GB');   /* dates as day/month/year — the site expects this */
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('FILL the form here (share this link):  ' + form.getPublishedUrl());
  Logger.log('EDIT the form here (keep private):     ' + form.getEditUrl());
  Logger.log('SHEET with responses (for step 5):     ' + ss.getUrl());
}
