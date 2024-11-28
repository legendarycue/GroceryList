$(document).ready(function() {
    // Function to handle adding items
    $('#addItemForm').submit(function(event) {
        event.preventDefault();

        // Get form values
        const itemName = $('#itemName').val().trim();
        const itemQuantity = $('#itemQuantity').val().trim();
        const itemCategory = $('#itemCategory').val();
        const assignedTo = $('#assignedTo').val().trim();
        const action = $(event.originalEvent.submitter).attr('id');

        if (itemName === "" || itemQuantity === "" || !itemCategory || assignedTo === "") {
            alert("Please fill in all fields.");
            return;
        }

        // Create list item elements
        const listItem = $('<li></li>');

        const checkbox = $('<input type="checkbox" name="item">');
        checkbox.prop('checked', action === 'addHave');

        const nameSpan = $('<span class="item-name"></span>').text(itemName);
        const quantitySpan = $('<span class="item-quantity"></span>').text(`x${itemQuantity}`);
        const categorySpan = $('<span class="item-category"></span>').text(itemCategory);
        const assignedSpan = $('<span class="assigned-to"></span>').text(`Assigned to: ${assignedTo}`);
        const removeLink = $('<a href="#" class="remove-item">&#10006;</a>');

        // Append elements to listItem
        listItem.append(checkbox, nameSpan, quantitySpan, categorySpan, assignedSpan, removeLink);

        // Determine which list to append to
        const targetList = (action === 'addNeed') ? $('.need-list') : $('.have-list');
        targetList.append(listItem);

        // Clear form fields
        $('#addItemForm')[0].reset();

        // Update assigned responsibilities
        updateAssignedResponsibilities();
    });

    // Function to remove items
    $('ul').on('click', '.remove-item', function(event) {
        event.preventDefault();
        $(this).parent('li').remove();
        updateAssignedResponsibilities();
    });

    // Function to handle checkbox toggle
    $('ul').on('change', 'input[type=checkbox]', function() {
        const listItem = $(this).parent('li');
        if (this.checked) {
            $('.have-list').append(listItem);
        } else {
            $('.need-list').append(listItem);
        }
        updateAssignedResponsibilities();
    });

    // Function to update assigned responsibilities
    function updateAssignedResponsibilities() {
        const assignments = {};

        $('.need-list li, .have-list li').each(function() {
            const person = $(this).find('.assigned-to').text().replace('Assigned to: ', '').trim();
            const item = $(this).find('.item-name').text().trim();
            const quantity = $(this).find('.item-quantity').text().trim();
            const category = $(this).find('.item-category').text().trim();
            const status = $(this).find('input[type="checkbox"]').is(':checked') ? 'Have' : 'Need';

            if (!assignments[person]) {
                assignments[person] = [];
            }

            assignments[person].push({
                item: item,
                quantity: quantity,
                category: category,
                status: status
            });
        });

        // Clear the assigned-cards section
        $('.assigned-cards').empty();

        // Create cards for each individual
        for (const person in assignments) {
            const card = $('<div class="assigned-card"></div>');
            const header = $('<h3></h3>').text(person);
            const list = $('<ul></ul>');

            assignments[person].forEach(entry => {
                const listItem = $('<li></li>').text(`${entry.item} (${entry.quantity}) - ${entry.category} [${entry.status}]`);
                list.append(listItem);
            });

            card.append(header, list);
            $('.assigned-cards').append(card);
        }
    }

    // Initial call to populate assigned responsibilities
    updateAssignedResponsibilities();
});
