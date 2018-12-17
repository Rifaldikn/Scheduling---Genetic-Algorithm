/**
 * Time Table Program with Genetic Algorithm
 * Author: Rifaldi Kusnawan
 */

/**
 * Fungsi Inisialisasi Awal
 * Mengassign setiap mapel yang sesuai(wajib dan peminatan) ke dalam setiap kelas
 * Yang diassign merupakan [Angkatan, Jurusan, Kelas, Hari, Slot Waktu Mulai, Selesai, Mapel, Guru]
 * Variable acak yang diassign adalah [Hari, Slot Waktu]
 * Slot waktu akan dimulai pada {n - 2} dimana n jumlah slot waktu
 * Setiap mapel yang memiliki lebih dari 3 sks, maka akan dijadikan 2x pertemuan dalam seminggu
 * @param {Berisikan data guru, kelas, dll} data
 * @param {Banyak populasi awal yang dihasilkan} populations
 */
const initialize = (data, populations) => {
  var chromosome = [],
    daftar_kelas = data.classes,
    wajib = data.subjects.wajib,
    ipa = data.subjects.ipa,
    ips = data.subjects.ips,
    bhs = data.subjects.bhs;
  // var count = 0
  for (let i = 0; i < populations; i++) {
    var slot = [];
    daftar_kelas.forEach((angkatan, a) => {
      angkatan.forEach((jurusan, j) => {
        for (var k = 0; k < jurusan; k++) {
          var start, end, subject, teacher, day;
          wajib.forEach(element => {
            if (element.credit > 3) {
              for (let x = 0; x < element.credit; x++) {
                day = randomize(0, 4);
                if (day == 1) {
                  start = randomize(0, 6);
                } else {
                  start = randomize(0, 7);
                } // karena ada 12 slot waktu
                end = start + Number(element.credit) - 2;
                subject = Number(element.id);
                teacher =
                  element.teachers[randomize(0, element.teachers.length)];
                slot.push([a, j, k, day, start, end, subject, teacher]);
              }
            } else {
              day = randomize(0, 4);
              if (day == 1) {
                start = randomize(0, 6);
              } else {
                start = randomize(0, 7);
              } // karena ada 12 slot waktu
              end = start + Number(element.credit);
              subject = Number(element.id);
              teacher = element.teachers[randomize(0, element.teachers.length)];
              slot.push([a, j, k, day, start, end, subject, teacher]);
            }
          });
          var peminatan;
          switch (j) {
            case 0:
              peminatan = ipa;
              break;
            case 1:
              peminatan = ips;
              break;
            case 2:
              peminatan = bhs;
              break;
          }
          peminatan.forEach(element => {
            if (element.credit > 3) {
              for (let x = 0; x < element.credit; x++) {
                day = randomize(0, 4);
                if (day == 1) {
                  start = randomize(0, 6);
                } else {
                  start = randomize(0, 7);
                } // karena ada 12 slot waktu
                end = start + Number(element.credit) - 2;
                subject = Number(element.id);
                teacher =
                  element.teachers[randomize(0, element.teachers.length)];
                slot.push([a, j, k, day, start, end, subject, teacher]);
              }
            } else {
              day = randomize(0, 4);
              if (day == 1) {
                start = randomize(0, 6);
              } else {
                start = randomize(0, 7);
              } // karena ada 12 slot waktu
              end = start + Number(element.credit);
              subject = Number(element.id);
              teacher = element.teachers[randomize(0, element.teachers.length)];
              slot.push([a, j, k, day, start, end, subject, teacher]);
            }
          });
        }
      });
    });
    chromosome.push(slot);
  }
  return new Promise((resolve, reject) => {
    resolve(chromosome);
  });
};

/**
 * Fitness
 * Setiap guru mengajar hanya pada satu kelas pada saat yang sama
 * Jam olahraga tidak boleh di atas slot waktu 3 pada hari senin, 5 pada hari selasa,rabu, kamis dan jumat
 * Setiap guru wajib mengajar minimal 24 sks dan maksimal 40 sks
 * Guru mengajar pada satu kelas maksimal 2 sks, kecuali bahasa
 * Setiap kelas wajib memenuhi sks setiap mapel yang telah ditentukan
 * Setiap kelas wajib memenuhi sks mapel wajib 24 sks dan peminatan 16 sks
 */

const fitness_value = (population, teachers_length) => {
  var fitness_value = [];
  console.log(population);

  population.forEach(individu => {
    // chromosome.forEach((gene) => {
    fitness_value.push(fitness_evaluation(individu, teachers_length));
    // });
  });
  return new Promise((resolve, reject) => {
    resolve(fitness_value);
  });
};

const fitness_evaluation = (individu, teachers_length) => {
  // [a, j, k, day, start, end, subject, teacher]
  var penalty = 0;
  console.log(individu);
  for (let j = 0; j < individu.length; j++) {
    var teacher = individu[j][7],
      day = individu[j][3],
      start = individu[j][4];
    for (let i = 0; i < individu.length; i++) {
      var teacher_2 = individu[i][7],
        day_2 = individu[i][3],
        start_2 = individu[i][4];
      if (i == j) continue;
      if (day == day_2 && teacher == teacher_2 && start == start_2) {
        console.log(j, individu[j], i, individu[i]);
        penalty++;
      }

      // for (let j = 0; j < teachers_length; j++) {}
    }
  }

  return 1 / (1 + penalty);
};

/**
 * Fungsi mengambil daftar guru pada suatu mapel
 * Pada setiap mapel akan ada list guru yang mengajar
 * Fungsi akan mengembalikan nilai berupa array list guru
 * @param {Referensi id subject} subjectCode
 */
function getTeachersBySubjectCode(subjectCode) {
  return data.teachers.filter(teacher => teacher.subject == subjectCode);
}

/**
 * Fungsi untuk mencari nilai random berdasarkan rentang nilai
 * @param {batas angka minimal} min
 * @param {batas angka maksimal} max
 */
function randomize(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Mengexport fungsi yang ada agar dapat dipakai pada App.vue
 */
export default {
  initialize,
  fitness_evaluation,
  fitness_value
};
