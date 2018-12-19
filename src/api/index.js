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

  population.forEach(individu => {
    fitness_value.push(fitness_evaluation(individu, teachers_length));
  });
  return new Promise((resolve, reject) => {
    resolve(fitness_value);
  });
};

const fitness_evaluation = (individu, teachers_length) => {
  // [a, j, k, day, start, end, subject, teacher]
  var penalty = 0;
  // exist = false;
  // var bentrok = [],
  //   notBentrok = [];
  // for (let k = 0; k < individu.length; k++) {
  //   if (individu[k][7] < individu.length && individu[k][7] > 0) {
  //     exist = true;
  //   }
  //   for (let l = 0; l < individu.length; l++) {
  //     if (l == k) continue;
  //     if (
  //       individu[l][7] == individu[k][7] &&
  //       individu[l][3] == individu[k][3] &&
  //       individu[l][4] == individu[k][4]
  //     ) {
  //       bentrok.push([k, individu[k], l, individu[l]]);
  //       penalty += 0.1;
  //     } else {
  //       notBentrok.push([k, individu[k], l, individu[l]]);
  //     }
  //   }
  // }
  var jadwal_guru = [];
  for (let i = 0; i < teachers_length; i++) {
    var slot_guru = [],
      exist = false;
    individu.forEach(slot => {
      if (slot[7] == i + 1) {
        exist = true;
        slot_guru.push(slot);
      }
    });
    if (!exist) penalty++;
    jadwal_guru.push(slot_guru);
  }
  jadwal_guru.forEach(guru => {
    guru.forEach((slot_guru, index) => {
      var day = slot_guru[3],
        start = slot_guru[4],
        end = slot_guru[5],
        guru = slot_guru[7],
        credit = Number(end) - start;
      // console.log(guru);
      jadwal_guru.forEach(guru2 => {
        guru2.forEach((slot_guru_2, index2) => {
          var day_2 = slot_guru_2[3],
            start_2 = slot_guru_2[4],
            end_2 = slot_guru_2[5],
            guru_2 = slot_guru_2[7],
            credit_2 = Number(end) - start;

          if (index == index2) return;
          if (start == start_2 && day == day_2 && guru == guru_2) {
            penalty += 0.1;
          }
        });
      });
    });
  });
  // console.log(Math.floor(penalty), notBentrok);
  console.log(penalty);
  return 1 / (1 + Math.floor(penalty));
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
