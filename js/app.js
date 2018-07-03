Array.prototype.unique = function() {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

var tables = {}

$(function() {
  $('#group-z').show();
  $('#show-z').addClass('active');

  $('nav a').on('click', function(e) {
    e.preventDefault();
    $('nav a').removeClass('active');
    $(this).addClass('active');
    
    var id = $(this).attr('id');
    var group = id.charAt(id.length - 1);
    $('main > div').hide();
    $('#group-' + group).show();
  })
});

$(function() {
  initialize_tables();
  render_standings();


  $('.one-team > input').on('change', recalculate_match);
});

function recalculate_tables() {
  initialize_tables();
  $('.one-team').each(function(i, el) {
    points = $(el).find('.points').html();
    team = $(el).find('.team-name').html();
    group = $(el).parent().parent().parent().attr('id').slice(-1);
    tables[group][team] += +points;
  });

  render_standings();
}

function recalculate_match(e) {
  match = $(e.target.parentElement.parentElement);

  var team1_match = $(match).find('.one-team:first')
  var team2_match = $(match).find('.one-team:last')

  var goals1 = $(team1_match).find('input').val();
  var goals2 = $(team2_match).find('input').val();

  var team1_name = $(team1_match).find('.team-name').html();
  var team2_name = $(team2_match).find('.team-name').html();

  var team1_points_el = $(team1_match).find('.points')
  var team2_points_el = $(team2_match).find('.points')

  if(goals1 == "" || goals2 == "") {
    team1_points_el.html('0');
    team2_points_el.html('0');
  } else if (+goals1 > +goals2) {
    team1_points_el.html('3');
    team2_points_el.html('0');
  } else if(+goals2 > +goals1) {
    team1_points_el.html('0');
    team2_points_el.html('3');
  } else if(+goals1 == +goals2) {
    team1_points_el.html('1');
    team2_points_el.html('1');
  }

  recalculate_tables();
}

function render_standings() {
  var container = $('#group-z')
  container.html('');
  var html = "";
  $.each(tables, function(group, teams) {
    html += '<div class="group-table">';
    html += '<h3 align="center">Group '+ group.toUpperCase() +'</h3>';
    html += '<div class="group-header">'
    html += '<span class="country-header">Country</span>';
    html += '<span>Points</span>';
    html += '</div>';
    // Sort by points
    Object.keys(teams).map(function(key) {
      return [key, teams[key]]
    }).sort(function(a, b) {
        return b[1] - a[1];
    }).forEach(function(pair) {
      team = pair[0];
      points = pair[1];

      html += '<div class="team">';
      html += '<img class="flag" src="./images/' + team + '.png" alt="' + team + '">';
      html += '<span class="team-name">' + team + '</span>';
      html += '<span class="total-points">' + points + '</span>';
      html += '</div>';
    });
    html +='</div>';
  });
  container.append(html);
}

function initialize_tables() {
  $('main > div').each(function (i, el) {
    var id = $(el).attr('id');
    var group = id.charAt(id.length - 1);

    teams = $('#group-' + group)
      .find('.match > .one-team > span.team-name')
      .map(function() {
        return this.innerHTML;
      })
      .toArray()
      .unique()
      .forEach(function(team) {
        if (!tables[group]) {
          tables[group] = {}
        }

        tables[group][team] = 0;
      });
  });
}
