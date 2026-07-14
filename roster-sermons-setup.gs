                                          /* ════════════════════════════════════════════════════════════
                                             SOS CHURCH — ROSTER & SERMONS SHEETS · one-time setup script */

                                          function createRosterAndSermonsSheets() {
                                          var ss = SpreadsheetApp.create('SOS Church — roster & sermons');
                                          ss.setSpreadsheetLocale('en_GB');   /* dates as day/month/year — the site expects this */

                                          /* ── Roster tab ── first row is a blank cell then the Sunday
                                             dates; each row after is a role then the names (left empty
                                             here — the site shows a "—" until you fill them in). */
                                          var roster = ss.getActiveSheet().setName('Roster');
                                          roster.getRange(1, 1, 6, 5).setValues([
                                             [''].concat(nextSundays_(4)),              /* blank + the next four Sundays */
                                             ['Bible study',    '', '', '', ''],
                                             ['Song leading',   '', '', '', ''],
                                             ['Preaching',      '', '', '', ''],
                                             ["Lord's Supper",  '', '', '', ''],
                                             ['Offering',       '', '', '', '']
                                          ]);
                                          roster.setFrozenRows(1);
                                          roster.setFrozenColumns(1);
                                          roster.getRange(1, 1, 6, 1).setFontWeight('bold');
                                          roster.getRange(1, 1, 1, 5).setFontWeight('bold');

                                          /* ── Sermons tab ── three columns; add one row per week. */
                                          var sermons = ss.insertSheet('Sermons');
                                          sermons.getRange(1, 1, 1, 3).setValues([['Date', 'Title', 'PDF link']]);
                                          sermons.setFrozenRows(1);
                                          sermons.getRange(1, 1, 1, 3).setFontWeight('bold');
                                          sermons.setColumnWidth(2, 260);
                                          sermons.setColumnWidth(3, 420);

                                          Logger.log('YOUR SHEET (two tabs, ready to use):  ' + ss.getUrl());
                                          Logger.log('Next: publish EACH tab — File > Share > Publish to web > pick the tab > CSV > Publish — then send both links.');
                                          }

                                          /* the next n Sundays as short labels like "Jul 19", so the roster
                                             header starts out sensible; edit them freely afterwards */
                                          function nextSundays_(n) {
                                          var mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                          var d = new Date();
                                          d.setDate(d.getDate() + ((7 - d.getDay()) % 7));   /* this coming Sunday */
                                          var out = [];
                                          for (var i = 0; i < n; i++) {
                                             out.push(mon[d.getMonth()] + ' ' + d.getDate());
                                             d.setDate(d.getDate() + 7);
                                          }
                                          return out;
                                          }
