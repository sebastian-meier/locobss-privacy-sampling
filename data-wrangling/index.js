const fs = require('fs');
const parse = require('csv-parse/lib/sync');

// statistics for standard demographics

const files = ['local', 'regional', 'states', 'federal'];

let stats = {
  'age': {
    sum: false,
    keys: ['Overall'],
    values: {}
  },
  'gender': {
    sum: true,
    keys: ['male', 'female'],
    values: {}
  },
  'nationality': {
    sum: true,
    keys: ['german', 'non_german'],
    values: {}
  },
  'gender_nationality':{
    sum: true,
    keys: ['german_male', 'non_german_male', 'german_female', 'non_german_female'],
    values: {}
  },
  'age_gender': {
    sum: false,
    keys: ['male', 'female'],
    values: {}
  },
  'age_nationality': {
    sum: false,
    keys: ['german', 'non_german'],
    values: {}
  },
  'age_gender_nationality':{
    sum: false,
    keys: ['german_male', 'non_german_male', 'german_female', 'non_german_female'],
    values: {}
  }
};

files.forEach((f) => {
  const records = parse(fs.readFileSync(`./data/${f}.csv`, 'utf8'), {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';'
  });

  Object.keys(stats).forEach((key) => {
    stats[key].values[f] = Number.MAX_VALUE;
  });

  records.forEach((r) => {
    Object.keys(stats).forEach((key) => {
      if (!stats[key].sum) {
        stats[key].keys.forEach((k) => {
          if (!isNaN(parseInt(r[k]))) {
            if (parseInt(r[k]) < stats[key].values[f]) {
              stats[key].values[f] = parseInt(r[k]);
            }
          }
        });
      }
    });
  });

  Object.keys(stats).forEach((key) => {
    if (stats[key].sum) {
      let value = {};
      stats[key].keys.forEach((k) => {
        value[k] = {};
      });
      records.forEach((r) => {
        stats[key].keys.forEach((k) => {
          if (!isNaN(parseInt(r[k]))) {
            if (!(r.RaumID in value[k])) {
              value[k][r.RaumID] = 0;
            }
            value[k][r.RaumID] += parseInt(r[k]);
          }
        });
      });
      stats[key].keys.forEach((k) => {
        Object.keys(value[k]).forEach((raumid) => {
          if (value[k][raumid] < stats[key].values[f]) {
            stats[key].values[f] = value[k][raumid];
          }  
        });
      });
    }
  });
});

Object.keys(stats).forEach((key) => {
  delete stats[key].sum;
  delete stats[key].keys;
});

fs.writeFileSync('./output/spatial.json', JSON.stringify(stats), 'utf8');

// age pyramid for germany
let ageRecords = parse(fs.readFileSync(`./data/federal.csv`, 'utf8'), {
  columns: true,
  skip_empty_lines: true,
  delimiter: ';'
});

let ages = [[],[],[]];
ageRecords.forEach((r, ri) => {
  ages[0].push({
    key: ri,
    label: r.AgeGroup,
    value: parseInt(r.Overall) 
  });
});

ageRecords = parse(fs.readFileSync(`./data/marital.csv`, 'utf8'), {
  columns: true,
  skip_empty_lines: true,
  delimiter: ';'
});

ageRecords.forEach((r, ri) => {
  const columns = 'german_male_ledig;german_male_married;german_male_verwitwet;german_male_divorces;german_male_partnership;german_male_former_partnership;german_male_dead_partnership;german_female_ledig;german_female_married;german_female_verwitwet;german_female_divorces;german_female_partnership;german_female_former_partnership;german_female_dead_partnership;non_german_male_ledig;non_german_male_married;non_german_male_verwitwet;non_german_male_divorces;non_german_male_partnership;non_german_male_former_partnership;non_german_male_dead_partnership;non_german_female_ledig;non_german_female_married;non_german_female_verwitwet;non_german_female_divorces;non_german_female_partnership;non_german_female_former_partnership;non_german_female_dead_partnership'.split(';');
  let v = 0;
  columns.forEach((c) => {
    if (!isNaN(parseInt(r[c]))) {
      v += parseInt(r[c]);
    }
  });
  ages[1].push({
    key: ri,
    label: r.AgeGroup,
    value: v
  });
});

ageRecords = parse(fs.readFileSync(`./data/nationality.csv`, 'utf8'), {
  columns: true,
  skip_empty_lines: true,
  delimiter: ';'
});

const age_columns = [/under_3/,/3_to_6/,/6_to_10/,/10_to_15/,/15_to_18/,/18_to_21/,/21_to_30/,/30_to_50/,/50_to_60/,/60_to_65/,/65_and_up/];

age_columns.forEach((c, ci) => {
  let v = 0;
  ageRecords.forEach((r) => {
    Object.keys(r).forEach((k) => {
      if (k.match(c) && !isNaN(parseInt(r[k]))) {
        v += parseInt(r[k]);
      }
    });
  });
  ages[2].push({
    key: ci,
    label: c.toString().split('_').join(' '),
    value: v 
  });
})

fs.writeFileSync('./output/ages.json', JSON.stringify(ages), 'utf8');


// nationality, gender, marital, age

stats = {
  age:{
    sum: false,
    group: [/_/]
  },
  gender:{
    sum: true,
    group: [/^male_/, /female_/]
  },
  marital: {
    sum: true,
    group: [/ledig/,/married/,/verwitwet/,/divorces/,/partnership/,/former_partnership/,/dead_partnership/]
  },
  nationality: {
    sum: true,
    group: [/^german/,/non_german/]
  },
  gender_marital: {
    sum: true,
    group: [/^male_ledig/,/^male_married/,/^male_verwitwet/,/^male_divorces/,/^male_partnership/,/^male_former_partnership/,/^male_dead_partnership/,
      /female_ledig/,/female_married/,/female_verwitwet/,/female_divorces/,/female_partnership/,/female_former_partnership/,/female_dead_partnership/]
  },
  gender_marital_nationality: {
    sum: true,
    group: [/^german_male_ledig/,/^german_male_married/,/^german_male_verwitwet/,/^german_male_divorces/,/^german_male_partnership/,/^german_male_former_partnership/,/^german_male_dead_partnership/,/^german_female_ledig/,/^german_female_married/,/^german_female_verwitwet/,/^german_female_divorces/,/^german_female_partnership/,/^german_female_former_partnership/,/^german_female_dead_partnership/,/non_german_male_ledig/,/non_german_male_married/,/non_german_male_verwitwet/,/non_german_male_divorces/,/non_german_male_partnership/,/non_german_male_former_partnership/,/non_german_male_dead_partnership/,/non_german_female_ledig/,/non_german_female_married/,/non_german_female_verwitwet/,/non_german_female_divorces/,/non_german_female_partnership/,/non_german_female_former_partnership/,/non_german_female_dead_partnership/]
  },
  marital_nationality: {
    sum: true,
    group: [/^german.*ledig/,/^german.*married/,/^german.*verwitwet/,/^german.*divorces/,/^german.*partnership/,/^german.*former_partnership/,/^german.*dead_partnership/,
      /non_german.*ledig/,/non_german.*married/,/non_german.*verwitwet/,/non_german.*divorces/,/non_german.*partnership/,/non_german.*former_partnership/,/non_german.*dead_partnership/]
  },
  gender_nationality: {
    sum: true,
    group: [/^german_male/, /^german_female/, /non_german_male/, /non_german_female/]
  },
  gender_age: {
    sum: false,
    group: [/^male/, /female/]
  },
  marital_age: {
    sum: false,
    group: [/ledig/,/married/,/verwitwet/,/divorces/,/partnership/,/former_partnership/,/dead_partnership/]
  },
  nationality_age: {
    sum: false,
    group: [/^german/, /non_german/]
  },
  gender_marital_age: {
    sum: false,
    group: [/^male_ledig/,/^male_married/,/^male_verwitwet/,/^male_divorces/,/^male_partnership/,/^male_former_partnership/,/^male_dead_partnership/,
      /female_ledig/,/female_married/,/female_verwitwet/,/female_divorces/,/female_partnership/,/female_former_partnership/,/female_dead_partnership/]
  },
  gender_marital_nationality_age: {
    sum: false,
    group: [/^german_male_ledig/,/^german_male_married/,/^german_male_verwitwet/,/^german_male_divorces/,/^german_male_partnership/,/^german_male_former_partnership/,/^german_male_dead_partnership/,/^german_female_ledig/,/^german_female_married/,/^german_female_verwitwet/,/^german_female_divorces/,/^german_female_partnership/,/^german_female_former_partnership/,/^german_female_dead_partnership/,/non_german_male_ledig/,/non_german_male_married/,/non_german_male_verwitwet/,/non_german_male_divorces/,/non_german_male_partnership/,/non_german_male_former_partnership/,/non_german_male_dead_partnership/,/non_german_female_ledig/,/non_german_female_married/,/non_german_female_verwitwet/,/non_german_female_divorces/,/non_german_female_partnership/,/non_german_female_former_partnership/,/non_german_female_dead_partnership/]
  },
  marital_nationality_age: {
    sum: false,
    group: [/^german.*ledig/,/^german.*married/,/^german.*verwitwet/,/^german.*divorces/,/^german.*partnership/,/^german.*former_partnership/,/^german.*dead_partnership/,
      /non_german.*ledig/,/non_german.*married/,/non_german.*verwitwet/,/non_german.*divorces/,/non_german.*partnership/,/non_german.*former_partnership/,/non_german.*dead_partnership/]
  },
  gender_nationality_age: {
    sum: false,
    group: [/^german_male/, /^german_female/, /non_german_male/, /non_german_female/]
  }
}

let records = parse(fs.readFileSync(`./data/marital.csv`, 'utf8'), {
  columns: true,
  skip_empty_lines: true,
  delimiter: ';'
});

let columns = 'german_male_ledig;german_male_married;german_male_verwitwet;german_male_divorces;german_male_partnership;german_male_former_partnership;german_male_dead_partnership;german_female_ledig;german_female_married;german_female_verwitwet;german_female_divorces;german_female_partnership;german_female_former_partnership;german_female_dead_partnership;non_german_male_ledig;non_german_male_married;non_german_male_verwitwet;non_german_male_divorces;non_german_male_partnership;non_german_male_former_partnership;non_german_male_dead_partnership;non_german_female_ledig;non_german_female_married;non_german_female_verwitwet;non_german_female_divorces;non_german_female_partnership;non_german_female_former_partnership;non_german_female_dead_partnership'.split(';');
// AgeGroup

const getAllIndexes = (arr, val) => {
  const indexes = [];
  for(let i = 0; i < arr.length; i++)
      if (arr[i] === val)
          indexes.push(i);
  return indexes;
};

Object.keys(stats).forEach((key) => {
  stats[key]['value'] = Number.MAX_VALUE;
  stats[key]['values'] = [];
  stats[key].group.forEach((g) => {
    stats[key]['values'].push(0);
  });
  if (stats[key].sum) {
    records.forEach((r) => {
      columns.forEach((c) => {
        stats[key].group.forEach((g, gi) => {
          if (c.match(g) && !isNaN(parseInt(r[c]))) {
            stats[key].values[gi] += parseInt(r[c]);
          }
        });
      });
    });
  } else {
    records.forEach((r) => {
      const tValues = [];
      stats[key].group.forEach((g) => {
        tValues.push(0);
      });
      columns.forEach((c) => {
        stats[key].group.forEach((g, gi) => {
          if (c.match(g) && !isNaN(parseInt(r[c]))) {
            tValues[gi] += parseInt(r[c]);
          }
        });
      });
      stats[key]['values'] = [...stats[key]['values'], ...tValues];
    });
  }
  stats[key]['value'] = Math.min(...stats[key].values.filter((v) => v>0));
  stats[key]['smallest'] = [];
  const index = getAllIndexes(stats[key]['values'],stats[key]['value']);
  if (index.length > 0) {
    if (stats[key].sum) {
      index.forEach((i) => {
        stats[key]['smallest'].push(stats[key].group[i].toString());
      });
    } else {
      index.forEach((i) => {
        const row = Math.floor(i / stats[key].group.length);
        const col = i - row * stats[key].group.length;
        stats[key]['smallest'].push([stats[key].group[col].toString(), records[row - 1].AgeGroup]);
      });
    }
  }
  delete stats[key]['values'];
  delete stats[key]['group'];
  delete stats[key]['sum'];
});

fs.writeFileSync('./output/marital.json', JSON.stringify(stats, null, 1), 'utf8');

// nationality

stats = {
  nationality:{
    sum: false,
    group: [/^overall/]
  },
  age:{
    sum: true,
    group: [/overall_under_3/,/overall_3_to_6/,/overall_6_to_10/,/overall_10_to_15/,/overall_15_to_18/,/overall_18_to_21/,/overall_21_to_30/,/overall_30_to_50/,/overall_50_to_60/,/overall_60_to_65/,/overall_65_and_up/]
  },
  age_nationality:{
    sum: false,
    group: [/overall_under_3/,/overall_3_to_6/,/overall_6_to_10/,/overall_10_to_15/,/overall_15_to_18/,/overall_18_to_21/,/overall_21_to_30/,/overall_30_to_50/,/overall_50_to_60/,/overall_60_to_65/,/overall_65_and_up/]
  },
  gender:{
    sum: true,
    group: [/^male_/, /female_/]
  },
  gender_nationality:{
    sum: false,
    group: [/^male_/, /female_/]
  },
  age_gender:{
    sum: true,
    group: [/^male_under_3/,/^male_3_to_6/,/^male_6_to_10/,/^male_10_to_15/,/^male_15_to_18/,/^male_18_to_21/,/^male_21_to_30/,/^male_30_to_50/,/^male_50_to_60/,/^male_60_to_65/,/^male_65_and_up/,/female_under_3/,/female_3_to_6/,/female_6_to_10/,/female_10_to_15/,/female_15_to_18/,/female_18_to_21/,/female_21_to_30/,/female_30_to_50/,/female_50_to_60/,/female_60_to_65/,/female_65_and_up/]
  },
  age_gender_nationality: {
    sum: false,
    group: [/^male_under_3/,/^male_3_to_6/,/^male_6_to_10/,/^male_10_to_15/,/^male_15_to_18/,/^male_18_to_21/,/^male_21_to_30/,/^male_30_to_50/,/^male_50_to_60/,/^male_60_to_65/,/^male_65_and_up/,/female_under_3/,/female_3_to_6/,/female_6_to_10/,/female_10_to_15/,/female_15_to_18/,/female_18_to_21/,/female_21_to_30/,/female_30_to_50/,/female_50_to_60/,/female_60_to_65/,/female_65_and_up/]
  }
}

records = parse(fs.readFileSync(`./data/nationality.csv`, 'utf8'), {
  columns: true,
  skip_empty_lines: true,
  delimiter: ';'
});

// Nationality
// male, female, overall
columns = 'male_under_3;male_3_to_6;male_6_to_10;male_10_to_15;male_15_to_18;male_18_to_21;male_21_to_30;male_30_to_50;male_50_to_60;male_60_to_65;male_65_and_up;female_under_3;female_3_to_6;female_6_to_10;female_10_to_15;female_15_to_18;female_18_to_21;female_21_to_30;female_30_to_50;female_50_to_60;female_60_to_65;female_65_and_up;overall_under_3;overall_3_to_6;overall_6_to_10;overall_10_to_15;overall_15_to_18;overall_18_to_21;overall_21_to_30;overall_30_to_50;overall_50_to_60;overall_60_to_65;overall_65_and_up'.split(';');

Object.keys(stats).forEach((key) => {
  stats[key]['value'] = Number.MAX_VALUE;
  stats[key]['values'] = [];
  stats[key].group.forEach((g) => {
    stats[key]['values'].push(0);
  });
  if (stats[key].sum) {
    records.forEach((r) => {
      columns.forEach((c) => {
        stats[key].group.forEach((g, gi) => {
          if (c.match(g) && !isNaN(parseInt(r[c]))) {
            stats[key].values[gi] += parseInt(r[c]);
          }
        });
      });
    });
  } else {
    records.forEach((r) => {
      const tValues = [];
      stats[key].group.forEach((g) => {
        tValues.push(0);
      });
      columns.forEach((c) => {
        stats[key].group.forEach((g, gi) => {
          if (c.match(g) && !isNaN(parseInt(r[c]))) {
            tValues[gi] += parseInt(r[c]);
          }
        });
      });
      stats[key]['values'] = [...stats[key]['values'], ...tValues];
    });
  }
  stats[key]['value'] = Math.min(...stats[key].values.filter((v) => v>0));
  stats[key]['smallest'] = [];
  const index = getAllIndexes(stats[key]['values'],stats[key]['value']);
  if (index.length > 0) {
    if (stats[key].sum) {
      index.forEach((i) => {
        stats[key]['smallest'].push(stats[key].group[i].toString());
      });
    } else {
      index.forEach((i) => {
        const row = Math.floor(i / stats[key].group.length);
        const col = i - row * stats[key].group.length;
        stats[key]['smallest'].push([stats[key].group[col].toString(), records[row - 1].Nationality]);
      });
    }
  }
  delete stats[key]['values'];
  delete stats[key]['group'];
  delete stats[key]['sum'];
});

fs.writeFileSync('./output/nationality.json', JSON.stringify(stats, null, 1), 'utf8');