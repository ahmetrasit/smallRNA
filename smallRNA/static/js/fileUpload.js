

var fileSelect = document.getElementById('file-select');
var fastqgz_files = []

fileSelect.onchange = function(event){
  var fastqgz_files = []
  var files = fileSelect.files;
  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    // Check the file type.
    if (file.type.match('.*gz')) {
      fastqgz_files.push(file.name)
    }
  }
  if (fastqgz_files.length > 1) {
    $('#file_label').html(fastqgz_files.length + ' files selected')
    populateMultipleSamplesTab()
    populateSingleSampleTab()
    populateDemultiplexTab()
  }else if (fastqgz_files.length > 0) {
    $('#file_label').html(fastqgz_files.length + ' file selected')
    populateMultipleSamplesTab()
    populateSingleSampleTab()
    populateDemultiplexTab()
  }else {
    $('#file_label').html('Choose file')
  }

}

function uploadFiles(){
  var notFastq = false

  var files = fileSelect.files;
  var formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    // Check the file type.
    if (file.type.match('.*.gz')) {
      formData.append('filesToUpload', file, file.name);
      fastqgz_files.push(file.name)
    }else{
      notFastq = true
    }
  }
  if (notFastq) {
    //alert('Sorry, I can process only fastq.gz files. Those will be removed from the file list.')
  }

  var xhr = new XMLHttpRequest()
  xhr.open('POST', '/uploadFASTQ/', true);
  xhr.upload.addEventListener('progress', onProgress, false);

  function onProgress(e) {
    if (e.lengthComputable) {
      var perc = parseInt(100 * e.loaded / e.total)
      $('#progressbar').attr('style', 'width:'+perc+'%')
    }
  }

  xhr.onload = function () {
    if (xhr.status === 200) {
      //uploadButton.innerHTML = 'Upload';
    } else {
      //alert('Sorry, there is something wrong. Maybe the server is down, or you lost connection.');
    }
  };

  xhr.onloadstart = function (e) {
      $('#progress-bar-container').attr('style', 'visibility:visible')
  }
  xhr.onloadend = function (e) {
      $('#progress-bar-container').attr('style', 'visibility:hidden')
  }

  xhr.send(formData);
}

function populateMultipleSamplesTab() {
  console.log('hey')
  var fastqgz_files = []
  var files = fileSelect.files;
  var formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    // Check the file type.
    if (file.type.match('.*g')) {
      fastqgz_files.push(file.name)
    }
  }

  d3.select('#multiple').html("")
  if (fastqgz_files.length>0) {
    d3.select('#multiple').html('<div class="row"><div class="col-12 text-left h6 mt-3">Each fastq.gz file belongs to a different sample:</div></div>')
    d3.select('#multiple').append('div').attr('class', 'row')
      .html('<div class="col-md-4 text-left">File Name</div><div class="col-md-2 text-left">Sample Name</div><div class="col-md-2 text-left">Sample Type</div><div class="col-md-2 text-left">Genotype</div><div class="col-md-2 text-left">Description</div>')
    file_forms = d3.select('#multiple').selectAll('div.form-row').data(fastqgz_files).enter()
      .append('div').attr('class', 'form-row')
    file_forms.append('div').attr('class', 'form-group col-md-4 text-left')
      .append('div').attr('class', 'text-truncate pt-2').html(function(d){return '<span class="align-middle">'+d+'</span>'})
    file_forms.append('div').attr('class', 'form-group col-md-2 text-left')
      .append('input').attr('type', 'text').attr('class', 'form-control').attr('name', 'sample_name').attr('id', 'sample_name')
        .attr('placeholder', 'Sample name')
    file_forms.append('div').attr('class', 'form-group col-md-2 text-left')
      .append('select').attr('class', 'form-control').attr('name', 'sample_type').attr('id', 'sample_type')
    file_forms.append('div').attr('class', 'form-group col-md-2 text-left')
      .append('select').attr('class', 'form-control').attr('name', 'genotype').attr('id', 'genotype')
    file_forms.append('div').attr('class', 'form-group col-md-2 text-left')
      .append('input').attr('type', 'text').attr('class', 'form-control').attr('name', 'description').attr('id', 'description')
        .attr('placeholder', 'Description for this sample')

    d3.selectAll('#genotype').selectAll('option').data(genotype_options).enter()
      .append('option').text(function(d){return d})
    d3.selectAll('#genotype').on('change', checkGenotype)

    d3.selectAll('#sample_type').selectAll('option').data(sample_type_options).enter()
      .append('option').text(function(d){return d})
    d3.selectAll('#sample_type').on('change', checkSampleType)
  }else {
    d3.select('#multiple').html('<div class="row"><div class="col-12 text-left h6 mt-3">Please select files first.</div></div>')
  }

}

function populateSingleSampleTab() {
  var fastqgz_files = []
  var files = fileSelect.files;
  var formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (file.type.match('.*gz')) {
      fastqgz_files.push(file.name)
    }
  }

  d3.select('#single').html("")
  if (fastqgz_files.length>0) {
    d3.select('#single').html('<div class="row"><div class="col-12 text-left h6 mt-3">Selected fastq.gz file(s) belong to a single sample:</div></div>')
    d3.select('#single').append('div').attr('class', 'row')
      .html('<div class="col-md-4 text-left pl-4">Sample Name</div><div class="col-md-2 text-left">Sample Type</div><div class="col-md-2 text-left">Genotype</div><div class="col-md-4 text-left">Description</div>')
    file_forms = d3.select('#single').selectAll('div.form-row').data(['dummy']).enter()
      .append('div').attr('class', 'form-row')
    file_forms.append('div').attr('class', 'form-group col-md-4 text-left')
      .append('input').attr('type', 'text').attr('class', 'form-control').attr('name', 'sample_name').attr('id', 'sample_name')
        .attr('placeholder', 'Sample name')
    file_forms.append('div').attr('class', 'form-group col-md-2 text-left')
      .append('select').attr('class', 'form-control').attr('name', 'sample_type').attr('id', 'sample_type')
    file_forms.append('div').attr('class', 'form-group col-md-2 text-left')
      .append('select').attr('class', 'form-control').attr('name', 'genotype').attr('id', 'genotype')
    file_forms.append('div').attr('class', 'form-group col-md-4 text-left')
      .append('input').attr('type', 'text').attr('class', 'form-control').attr('name', 'description').attr('id', 'description')
        .attr('placeholder', 'Description for this sample')

    d3.selectAll('#genotype').selectAll('option').data(genotype_options).enter()
      .append('option').text(function(d){return d})
    d3.selectAll('#genotype').on('change', checkGenotype)

    d3.selectAll('#sample_type').selectAll('option').data(sample_type_options).enter()
      .append('option').text(function(d){return d})
    d3.selectAll('#sample_type').on('change', checkSampleType)

  }else {
    d3.select('#single').html('<div class="row"><div class="col-12 text-left h6 mt-3">Please select files first.</div></div>')
  }
}


function populateDemultiplexTab() {
  var fastqgz_files = []
  var files = fileSelect.files;
  var formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (file.type.match('.*gz')) {
      fastqgz_files.push(file.name)
    }
  }

  //d3.select('#demultiplex').html("")
  if (fastqgz_files.length>0) {
    d3.selectAll('.moreThanOneFile').style('display', 'flex')
    d3.selectAll('.noFile').style('display', 'none')


  }else {
    d3.selectAll('.moreThanOneFile').style('display', 'none')
    d3.selectAll('.noFile').style('display', 'flex')

  }
}




function addIndexToMultiplexTab() {
  file_forms = d3.select('#demultiplex').append('div').attr('class', 'form-row moreThanOneFile')
  file_forms.append('div').attr('class', 'form-group col-md-2 text-left').html('<div class="input-group"><div class="input-group-prepend"><span class="input-group-text text-white" id="basic-addon1" onclick="deleteRow(this)" style="background-color:red"><i class="fas fa-trash-alt smaller-font"></i></span></div><input type="text" class="form-control" name="sample_name" id="sample_name" placeholder="Sample name" aria-label="Sample name" aria-describedby="basic-addon1"></div>')
    //.append('input').attr('type', 'text').attr('class', 'form-control').attr('name', 'sample_name').attr('id', 'sample_name').attr('placeholder', 'Sample name')
  file_forms.append('div').attr('class', 'form-group col-md-2 text-left')
    .append('input').attr('type', 'text').attr('class', 'form-control').attr('name', 'barcode').attr('id', 'barcode')
      .attr('placeholder', 'Barcode sequence')
  file_forms.append('div').attr('class', 'form-group col-md-2 text-left')
    .append('select').attr('class', 'form-control').attr('name', 'sample_type').attr('id', 'sample_type')
  file_forms.append('div').attr('class', 'form-group col-md-2 text-left')
    .append('select').attr('class', 'form-control').attr('name', 'genotype').attr('id', 'genotype')
  file_forms.append('div').attr('class', 'form-group col-md-4 text-left')
    .append('input').attr('type', 'text').attr('class', 'form-control').attr('name', 'description').attr('id', 'description')
      .attr('placeholder', 'Description for this sample')

  d3.selectAll('#genotype').selectAll('option').data(genotype_options).enter()
    .append('option').text(function(d){return d})
  d3.selectAll('#genotype').on('change', checkGenotype)

  d3.selectAll('#sample_type').selectAll('option').data(sample_type_options).enter()
    .append('option').text(function(d){return d})
  d3.selectAll('#sample_type').on('change', checkSampleType)
}

function deleteRow(e){
  e.parentNode.parentNode.parentNode.parentNode.remove()
}

function checkGenotype() {
  console.log('genotype triggered')
}

function checkSampleType() {
  console.log('sample type triggered')
}
