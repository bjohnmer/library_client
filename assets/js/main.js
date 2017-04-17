$(document).on('ready', () => {

  //Llamada para cargar la tabla
  getAll();
  function getAll() {
    $.ajax({
      url: 'http://192.168.56.101/v1/authors',
      method: 'GET',
      dataType: 'json',
      success: (response) => {
        var author;
        if(! (response === null)){
          $('table tbody').empty()
          $.each(response, (key,val) => {
            author = `
              <tr id="${val.id}">
                <td>${val.first_name}</td>
                <td>${val.last_name}</td>
                <td>${val.bio}</td>
                <td>
                  <button type="button" class="btn btn-primary edit">Edit</button>
                  <button type="button" class="btn btn-danger delete">Delete</button>
                </td>
              </tr>
            `;
            $('table tbody').append(author);
          });
        }
      }
    });
  }

  //Registro o edición de datos
  $('#register_form').on('submit', (event) => {
    event.preventDefault();
    var data = $('#register_form').serializeArray();
    var $button = $('button[type="submit"]');
    if($button.attr('data-operation') === 'register'){
      $.ajax({
        url: 'http://192.168.56.101/v1/authors',
        method: 'POST',
        dataType: 'json',
        data: data,
        success: (response) => {
          getAll();
          alert('Registrado');
          $('button[type="reset"]').trigger('click');
        }
      });
    }else{
      // data.push({name: "id", value: $button.attr('id')});
      console.log(data);
      $.ajax({
        url: 'http://192.168.56.101/v1/authors/'+$button.attr('id'),
        method: 'PUT',
        dataType: 'json',
        data: data,
        success: (response) => {
          getAll();
          alert('Modificado');
          $('button[type="reset"]').trigger('click');
        }
      });
    }
  });

  //Limpiar formulario
  $('button[type="reset"]').on('click', () => {
    $('button[type="submit"]').attr('data-operation','register');
    $('button[type="submit"]').removeAttr('id');
    $('button[type="submit"]').text('Save');
  });

  //Cargar datos al formulario para editar
  $('.table').on('click','.edit', (event) => {
    var $button = $('button[type="submit"]');
    $button.attr('data-operation','edit');
    var id = $(event.currentTarget).parent().parent().attr('id');
    $.ajax({
      url: 'http://192.168.56.101/v1/authors/'+id,
      method: 'GET',
      dataType: 'json',
      success: (response) => {
        if(response.first_name === undefined){
          alert('Error al consultar');
        }else{
          $('#first_name').val(response.first_name);
          $('#last_name').val(response.last_name);
          $('#bio').val(response.bio);
          $('button[type="submit"]').attr('data-operation','edit');
          $('button[type="submit"]').attr('id',response.id);
          $('button[type="submit"]').text('Edit');
        }
      }
    });
  });

  //Eliminar registro
  $('.table').on('click','.delete', (event) => {
    if (confirm("¿Desea eliminar el registro?")) {
      $('button[type="reset"]').trigger('click');
      var $parent = $(event.currentTarget).parent().parent();
      var id = $parent.attr('id');
      $.ajax({
        url: 'http://192.168.56.101/v1/authors/'+id,
        method: 'DELETE',
        dataType: 'json',
        success: (response, textStatus, xhr) => {
          if(! (xhr.status === 200)){
            alert('Error al eliminar');
          }else{
            alert('Registro eliminado');
            $parent.remove();
          }
        }
      });
    }
  });
});