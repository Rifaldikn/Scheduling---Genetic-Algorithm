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
async function initialize (data, populations) {
  var chromosome = [],
    daftar_kelas = data.classes,
    wajib = data.subjects.wajib,
    ipa = data.subjects.ipa,
    ips = data.subjects.ips,
    bhs = data.subjects.bhs
  // var count = 0
  for (let i = 0; i < populations; i++) {
    var slot = []
    await daftar_kelas.forEach((angkatan, a) => {
      angkatan.forEach((jurusan, j) => {
        for (var k = 0; k < jurusan; k++) {
          var start, end, subject, teacher, day
          wajib.forEach(element => {
            if (element.credit > 3) {
              for (let x = 0; x < 3; x++) {
                // Devided assign slot into 2 session
                day = randomize(0, 4)
                if (day == 1) {
                  start = randomize(0, 6)
                } else {
                  start = randomize(0, 7)
                } // karena ada 12 slot waktu
                end = start + Number(element.credit) - 2
                subject = Number(element.id)
                teacher =
                  element.teachers[randomize(0, element.teachers.length)]
                slot.push([a, j, k, day, start, end, subject, teacher])
              }
            } else {
              day = randomize(0, 4)
              if (day == 1) {
                start = randomize(0, 6)
              } else {
                start = randomize(0, 7)
              } // karena ada 12 slot waktu
              end = start + Number(element.credit)
              subject = Number(element.id)
              teacher = element.teachers[randomize(0, element.teachers.length)]
              slot.push([a, j, k, day, start, end, subject, teacher])
            }
          })
          var peminatan
          switch (j) {
            case 0:
              peminatan = ipa
              break;
            case 1:
              peminatan = ips
              break;
            case 2:
              peminatan = bhs
              break;
          }
          peminatan.forEach(element => {
            if (element.credit > 3) {
              for (let x = 0; x < 3; x++) {
                day = randomize(0, 4)
                if (day == 1) {
                  start = randomize(0, 6)
                } else {
                  start = randomize(0, 7)
                } // karena ada 12 slot waktu
                end = start + Number(element.credit) - 2
                subject = Number(element.id)
                teacher =
                  element.teachers[randomize(0, element.teachers.length)]
                slot.push([a, j, k, day, start, end, subject, teacher])
              }
            } else {
              day = randomize(0, 4)
              if (day == 1) {
                start = randomize(0, 6)
              } else {
                start = randomize(0, 7)
              } // karena ada 12 slot waktu
              end = start + Number(element.credit)
              subject = Number(element.id)
              teacher = element.teachers[randomize(0, element.teachers.length)]
              slot.push([a, j, k, day, start, end, subject, teacher])
            }
          })
        }
      })
    })
    chromosome.push(slot)
  }
  // await console.log(chromosome)
  return new Promise((resolve, reject) => {
    if (!chromosome) {
      reject(new Error('Error!'))
    } else {
      resolve(chromosome)
    }
  })
  // return chromosome
}

/**
 * Fitness
 * Setiap guru mengajar hanya pada satu kelas pada saat yang sama
 * Jam olahraga tidak boleh di atas slot waktu 3 pada hari senin, 5 pada hari selasa,rabu, kamis dan jumat
 * Setiap guru wajib mengajar minimal 24 sks dan maksimal 54 sks
 * Guru mengajar pada satu kelas maksimal 2 sks, kecuali bahasa
 * Setiap kelas wajib memenuhi sks setiap mapel yang telah ditentukan
 * Setiap kelas wajib memenuhi sks mapel wajib 24 sks dan peminatan 16 sks
 */

async function fitness_value (population, teachers_length) {
  var fitness_value = []

  await population.forEach(individu => {
    fitness_value.push(fitness_evaluation(individu, teachers_length))
  })
  return new Promise((resolve, reject) => {
    resolve(fitness_value)
  })
}

function fitness_evaluation (individu, teachers_length) {
  // [a, j, k, day, start, end, subject, teacher]
  // console.log(individu, teachers_length);
  var penalty = 0,
    jadwal_guru = []
  for (let i = 0; i < teachers_length; i++) {
    var slot_guru = [],
      exist = false
    individu.forEach(slot => {
      if (slot[7] == i + 1) {
        exist = true
        slot_guru.push(slot)
      }
    })
    if (!exist) penalty++

    jadwal_guru.push(slot_guru)
  }

  var test = []
  jadwal_guru.forEach((daftar_guru, index_daftar_guru) => {
    var totalCredit = 0
    // console.log(daftar_guru);
    daftar_guru.forEach((slot_guru, index) => {
      var day = slot_guru[3],
        start = slot_guru[4],
        end = slot_guru[5],
        subject = slot_guru[6],
        guru = slot_guru[7],
        credit = Number(end) - start
      totalCredit += credit

      if (subject == 8 && start > 4) {
        penalty += 0.2
      }

      jadwal_guru.forEach(guru2 => {
        guru2.forEach((slot_guru_2, index2) => {
          var day_2 = slot_guru_2[3],
            start_2 = slot_guru_2[4],
            guru_2 = slot_guru_2[7]

          if (index == index2) return
          if (start == start_2 && day == day_2 && guru == guru_2) {
            penalty += 0.2
          }
          test.push([credit, start, start_2])
          for (let sks = 2; sks < 4; sks++) {
            if (credit >= sks) {
              if (
                start + (sks - 1) == start_2 &&
                day == day_2 &&
                guru == guru2
              ) {
                penalty += 0.2
              }
            }
          }
        })
      })
    })

    if ((totalCredit * 45) / 60 > 54 && (totalCredit * 45) / 60 < 24) {
      penalty += 1
    }
  })
  // console.log(Math.floor(penalty), notBentrok);
  // console.log(penalty)
  return 1 / (1 + penalty)
}

function selection (fitness_arr) {
  var sum = sum_fitness(fitness_arr)
  var a = individu_probability(sum, fitness_arr)
  var b = cumulative_probability(a)
  var c = roulette(b, fitness_arr)
  return new Promise((resolve, reject) => {
    resolve(c)
  })
}

function individu_probability (sum_fitness, fitness_arr) {
  var temp = []
  fitness_arr.forEach(fitness_value => {
    temp.push(fitness_value / sum_fitness)
  })
  return temp
}

function sum_fitness (fitness_arr) {
  var temp = 0
  fitness_arr.forEach(element => {
    temp += element
  })
  return temp
}

function cumulative_probability (individu_probability) {
  var temp = [],
    x = 0
  for (let i = 0; i < individu_probability.length; i++) {
    x += individu_probability[i]
    temp.push(x)
  }
  return temp
}

function roulette (cumulative_probability, fitness_arr) {
  var temp = []
  while (temp.length < fitness_arr.length) {
    var rand = Math.random() * (fitness_arr.length - 0) + 0
    cumulative_probability.forEach((element, index) => {
      if (rand < cumulative_probability[0] && index == 0) {
        temp.push(index)
      } else if (cumulative_probability[index - 1] < rand && rand < element) {
        temp.push(index)
      }
    })
  }
  return temp
}

function crossover (cr, individu, selected) {
  var offspring = [], // array baru berupa offspring [array_individu,...]
    new_parent = [], // index hanya individu yang terpilih lewat probabilitas crossover
    selected_individu = [], // index [index_individu,...] untuk generasi baru
    cut_point = Math.floor(individu.length * (cr / 100)),
    r_acak = [] // menyimpan bilangan acak sesuai seleceted[index]

  // parent_selection(r_acak, cut_point, selected, new_parent).then(() => {
  //   crossing_process(new_parent, individu);
  // });
  while (r_acak.length < selected.length) {
    r_acak.push(Math.random() * (1 - 0) + 0)
  }

  while (new_parent.length < cut_point) {
    r_acak.forEach((acak, index) => {
      console.log(acak.toFixed(4))
      if (acak < cr / 100) {
        new_parent.push(individu[index])
      } else {
        offspring.push(individu[index])
      }
    })
  }

  // while (offspring.length < selected.length) {
  console.log([
    Math.floor(cut_point),
    selected.length,
    r_acak,
    new_parent,
    offspring,
    individu
  ])
  // }

  return new Promise((resolve, reject) => {
    resolve(offspring)
  })
}

function parent_selection (r_acak, cut_point, selected, new_parent) {}

function crossing_process (new_parent, individu) {}

/**
 * Fungsi mengambil daftar guru pada suatu mapel
 * Pada setiap mapel akan ada list guru yang mengajar
 * Fungsi akan mengembalikan nilai berupa array list guru
 * @param {Referensi id subject} subjectCode
 */
function getTeachersBySubjectCode (subjectCode) {
  return data.teachers.filter(teacher => teacher.subject == subjectCode)
}

/**
 * Fungsi untuk mencari nilai random berdasarkan rentang nilai
 * @param {batas angka minimal} min
 * @param {batas angka maksimal} max
 */
function randomize (min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

export default {
  initialize,
  fitness_value,
  selection,
  crossover
}
